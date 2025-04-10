import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, farmers, productCategories } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const farmerId = searchParams.get("farmerId");

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

    // Execute query with filters
    let allProducts;
    if (categoryId && farmerId) {
      // Filter by both category and farmer
      allProducts = await baseQuery
        .where(
          and(
            eq(products.categoryId, categoryId),
            eq(products.farmerId, farmerId)
          )
        )
        .all();
    } else if (categoryId) {
      // Filter by category only
      allProducts = await baseQuery
        .where(eq(products.categoryId, categoryId))
        .all();
    } else if (farmerId) {
      // Filter by farmer only
      allProducts = await baseQuery
        .where(eq(products.farmerId, farmerId))
        .all();
    } else {
      // No filters
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

// Add a new product (for farmers only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      unit,
      imageUrl,
      stock,
      categoryId,
      farmerId,
      isOrganic,
      isNonGMO,
      isSustainable,
      isPastureRaised,
    } = body;

    // Validate required fields
    if (!name || !description || !price || !unit || !categoryId || !farmerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify that the farmer exists
    const farmer = await db
      .select()
      .from(farmers)
      .where(eq(farmers.id, farmerId))
      .get();

    if (!farmer) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
    }

    // Create the new product
    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price: typeof price === "string" ? parseFloat(price) : price,
      unit,
      imageUrl: imageUrl || "/images/product-placeholder.jpg", // Default image if none provided
      stock: stock || 0,
      categoryId,
      farmerId,
      isOrganic: isOrganic || false,
      isNonGMO: isNonGMO || false,
      isSustainable: isSustainable || false,
      isPastureRaised: isPastureRaised || false,
      createdAt: new Date().toISOString(),
    };

    // Insert the new product into the database
    const result = await db
      .insert(products)
      .values(newProduct)
      .returning()
      .get();

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
