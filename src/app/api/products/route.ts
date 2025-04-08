import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, farmers, productCategories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    // Base query to get all products
    let baseQuery = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        unit: products.unit,
        imageUrl: products.imageUrl,
        stock: products.stock,
        isOrganic: products.isOrganic,
        isNonGMO: products.isNonGMO,
        isSustainable: products.isSustainable,
        isPastureRaised: products.isPastureRaised,
        categoryId: products.categoryId,
        farmerId: products.farmerId,
        categoryName: productCategories.name,
        farmerName: farmers.farmName,
      })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.categoryId, productCategories.id)
      )
      .leftJoin(farmers, eq(products.farmerId, farmers.id));

    // Execute query with or without filter
    let allProducts;
    if (categoryId) {
      allProducts = await baseQuery
        .where(eq(products.categoryId, categoryId))
        .all();
    } else {
      allProducts = await baseQuery.all();
    }

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
