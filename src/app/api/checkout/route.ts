import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import {
  cartItems,
  products,
  orders,
  orderItems,
  farmerRevenue,
  customerAnalytics,
  productAnalytics,
  farmers,
  users,
} from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { format } from "date-fns";

// Checkout API to process orders
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPostalCode,
    } = body;

    // Validation
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get all cart items for the user
    const userCartItems = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
      })
      .from(cartItems)
      .where(eq(cartItems.userId, userId))
      .all();

    if (userCartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Get product details for all items in the cart
    const productIds = userCartItems.map((item) => item.productId);
    const productsInCart = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        stock: products.stock,
        farmerId: products.farmerId,
      })
      .from(products)
      .where(inArray(products.id, productIds))
      .all();

    // Create a map for easier access to product details
    const productMap = productsInCart.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<string, (typeof productsInCart)[0]>);

    // Validate stock and calculate order total
    let orderTotal = 0;
    const outOfStockItems = [];

    for (const cartItem of userCartItems) {
      const product = productMap[cartItem.productId];
      if (!product) {
        return NextResponse.json(
          { error: `Product ${cartItem.productId} not found` },
          { status: 404 }
        );
      }

      // Check if enough stock is available
      if (product.stock < cartItem.quantity) {
        outOfStockItems.push({
          productId: product.id,
          name: product.name,
          requestedQuantity: cartItem.quantity,
          availableStock: product.stock,
        });
      }

      // Add to order total
      orderTotal += product.price * cartItem.quantity;
    }

    // If any items are out of stock, return error
    if (outOfStockItems.length > 0) {
      return NextResponse.json(
        {
          error: "Some items are out of stock",
          outOfStockItems,
        },
        { status: 400 }
      );
    }

    // Begin transaction
    return await db.transaction(async (tx) => {
      // Create a new order
      const now = new Date().toISOString();
      const orderId = uuidv4();

      await tx.insert(orders).values({
        id: orderId,
        userId,
        total: orderTotal,
        status: "processing",
        shippingAddress,
        shippingCity,
        shippingState,
        shippingPostalCode,
        createdAt: now,
        updatedAt: now,
      });

      // Create order items and update product stock
      const orderItemsData = [];
      const stockUpdates = [];
      const revenueRecords = [];
      const productAnalyticsUpdates = [];
      const todayDateStr = format(new Date(), "yyyy-MM-dd");

      // Group cart items by farmer for revenue tracking
      const farmerRevenues: Record<string, number> = {};

      for (const cartItem of userCartItems) {
        const product = productMap[cartItem.productId];

        // Create order item
        const orderItemId = uuidv4();
        orderItemsData.push({
          id: orderItemId,
          orderId,
          productId: cartItem.productId,
          farmerId: product.farmerId,
          quantity: cartItem.quantity,
          pricePerUnit: product.price,
          productName: product.name,
          createdAt: now,
        });

        // Update stock
        stockUpdates.push(
          tx
            .update(products)
            .set({
              stock: product.stock - cartItem.quantity,
            })
            .where(eq(products.id, cartItem.productId))
        );

        // Track revenue by farmer
        const revenue = product.price * cartItem.quantity;
        if (farmerRevenues[product.farmerId]) {
          farmerRevenues[product.farmerId] += revenue;
        } else {
          farmerRevenues[product.farmerId] = revenue;
        }

        // Prepare product analytics update
        productAnalyticsUpdates.push({
          productId: cartItem.productId,
          quantitySold: cartItem.quantity,
          revenue,
        });
      }

      // Insert all order items
      if (orderItemsData.length > 0) {
        await tx.insert(orderItems).values(orderItemsData);
      }

      // Execute all stock updates in parallel
      await Promise.all(stockUpdates);

      // Create revenue records for each farmer
      for (const [farmerId, amount] of Object.entries(farmerRevenues)) {
        revenueRecords.push({
          id: uuidv4(),
          farmerId,
          orderId,
          amount,
          date: todayDateStr,
          createdAt: now,
        });
      }

      // Insert all revenue records
      if (revenueRecords.length > 0) {
        await tx.insert(farmerRevenue).values(revenueRecords);
      }

      // Update product analytics
      for (const update of productAnalyticsUpdates) {
        // Check if analytics record exists
        const analyticsRecord = await tx
          .select()
          .from(productAnalytics)
          .where(eq(productAnalytics.productId, update.productId))
          .get();

        if (analyticsRecord) {
          // Update existing record
          await tx
            .update(productAnalytics)
            .set({
              totalSold: analyticsRecord.totalSold + update.quantitySold,
              totalRevenue: analyticsRecord.totalRevenue + update.revenue,
              lastSoldDate: todayDateStr,
              updatedAt: now,
            })
            .where(eq(productAnalytics.id, analyticsRecord.id));
        } else {
          // Create new record
          await tx.insert(productAnalytics).values({
            id: uuidv4(),
            productId: update.productId,
            totalSold: update.quantitySold,
            totalRevenue: update.revenue,
            lastSoldDate: todayDateStr,
            updatedAt: now,
          });
        }
      }

      // Update customer analytics
      const customerRecord = await tx
        .select()
        .from(customerAnalytics)
        .where(eq(customerAnalytics.userId, userId))
        .get();

      // Get a list of unique categories and farmers from this order
      const uniqueFarmerIds = Array.from(
        new Set(orderItemsData.map((item) => item.farmerId))
      );

      if (customerRecord) {
        // Update existing customer record
        let preferredFarmers = customerRecord.preferredFarmers
          ? JSON.parse(customerRecord.preferredFarmers)
          : [];

        // Add new unique farmer IDs
        for (const farmerId of uniqueFarmerIds) {
          if (!preferredFarmers.includes(farmerId)) {
            preferredFarmers.push(farmerId);
          }
        }

        await tx
          .update(customerAnalytics)
          .set({
            totalOrders: customerRecord.totalOrders + 1,
            totalSpent: customerRecord.totalSpent + orderTotal,
            lastOrderDate: todayDateStr,
            preferredFarmers: JSON.stringify(preferredFarmers),
            updatedAt: now,
          })
          .where(eq(customerAnalytics.id, customerRecord.id));
      } else {
        // Create new customer record
        await tx.insert(customerAnalytics).values({
          id: uuidv4(),
          userId,
          totalOrders: 1,
          totalSpent: orderTotal,
          firstOrderDate: todayDateStr,
          lastOrderDate: todayDateStr,
          preferredFarmers: JSON.stringify(uniqueFarmerIds),
          updatedAt: now,
        });
      }

      // Clear the user's cart after successful order
      await tx.delete(cartItems).where(eq(cartItems.userId, userId));

      // Return the order details
      return NextResponse.json(
        {
          orderId,
          total: orderTotal,
          status: "processing",
          message: "Order placed successfully",
        },
        { status: 201 }
      );
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve order history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const farmerId = searchParams.get("farmerId");

    if (!userId && !farmerId) {
      return NextResponse.json(
        { error: "Either user ID or farmer ID is required" },
        { status: 400 }
      );
    }

    // For consumers: Get their order history
    if (userId) {
      const userOrders = await db
        .select({
          id: orders.id,
          total: orders.total,
          status: orders.status,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(orders.createdAt)
        .all();

      return NextResponse.json(userOrders);
    }

    // For farmers: Get orders containing their products
    if (farmerId) {
      const farmerOrders = await db
        .select({
          orderId: orderItems.orderId,
          productName: orderItems.productName,
          quantity: orderItems.quantity,
          pricePerUnit: orderItems.pricePerUnit,
          total: orders.total,
          status: orders.status,
          createdAt: orders.createdAt,
          customerName: users.firstName,
        })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .innerJoin(users, eq(orders.userId, users.id))
        .where(eq(orderItems.farmerId, farmerId))
        .orderBy(orders.createdAt)
        .all();

      return NextResponse.json(farmerOrders);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
