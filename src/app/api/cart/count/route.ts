import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cartItems } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

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

    // Count cart items for the user
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(cartItems)
      .where(eq(cartItems.userId, userId))
      .get();

    return NextResponse.json({ count: result?.count || 0 });
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart count" },
      { status: 500 }
    );
  }
}
