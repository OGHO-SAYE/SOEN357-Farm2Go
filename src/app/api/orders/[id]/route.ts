import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, orderItems, products, farmers, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const orderId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // First, verify that the order belongs to the user
    const orderDetails = await db
      .select({
        id: orders.id,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
        shippingAddress: orders.shippingAddress,
        shippingCity: orders.shippingCity,
        shippingState: orders.shippingState,
        shippingPostalCode: orders.shippingPostalCode,
      })
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
      .get();

    if (!orderDetails) {
      return NextResponse.json(
        { error: "Order not found or does not belong to the user" },
        { status: 404 }
      );
    }

    // Get order items with product and farmer details
    const items = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        productName: orderItems.productName,
        quantity: orderItems.quantity,
        pricePerUnit: orderItems.pricePerUnit,
        farmerId: orderItems.farmerId,
        farmerName: farmers.farmName,
      })
      .from(orderItems)
      .leftJoin(farmers, eq(orderItems.farmerId, farmers.id))
      .where(eq(orderItems.orderId, orderId))
      .all();

    // Combine order details with items
    const orderWithItems = {
      ...orderDetails,
      items,
    };

    return NextResponse.json(orderWithItems);
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
