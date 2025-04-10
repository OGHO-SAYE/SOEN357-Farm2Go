import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cartItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Delete all cart items for this user
    await db.delete(cartItems).where(eq(cartItems.userId, userId));

    return NextResponse.json(
      { message: "Cart cleared successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
