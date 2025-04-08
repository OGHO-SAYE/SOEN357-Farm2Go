import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { cartItems, products, farmers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET cart items for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Retrieve cart items with product details
    const cartWithProducts = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
        product: {
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          unit: products.unit,
          imageUrl: products.imageUrl,
          stock: products.stock,
          farmerId: products.farmerId,
          farmerName: farmers.farmName,
        },
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(farmers, eq(products.farmerId, farmers.id))
      .where(eq(cartItems.userId, userId))
      .all();

    return NextResponse.json(cartWithProducts);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

// Add or update cart item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, quantity } = body;

    if (!userId || !productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "User ID, product ID, and quantity are required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .get();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if item already exists in cart
    const existingCartItem = await db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
      )
      .get();

    let result;

    if (existingCartItem) {
      // Update existing cart item quantity
      result = await db
        .update(cartItems)
        .set({ quantity })
        .where(eq(cartItems.id, existingCartItem.id))
        .returning()
        .get();
    } else {
      // Add new cart item
      const newCartItem = {
        id: uuidv4(),
        userId,
        productId,
        quantity,
        createdAt: new Date().toISOString(),
      };

      result = await db.insert(cartItems).values(newCartItem).returning().get();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// Delete cart item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Cart item ID and user ID are required" },
        { status: 400 }
      );
    }

    // Verify the cart item belongs to the user
    const cartItem = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.id, id), eq(cartItems.userId, userId)))
      .get();

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Delete the cart item
    await db.delete(cartItems).where(eq(cartItems.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}
