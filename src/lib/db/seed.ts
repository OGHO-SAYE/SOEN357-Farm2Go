import { v4 as uuidv4 } from "uuid";
import { db } from "./index";
import { productCategories, products, farmers, users } from "./schema";
import { eq, sql } from "drizzle-orm";

// Sample farmer data for products
// We'll use this farmer as the producer for our example products
const SAMPLE_FARMER_EMAIL = "john.appleseed@farm2go.com";

export async function seedProductData() {
  try {
    console.log("Seeding product data...");

    // Check if data is already seeded
    const existingCategoriesCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(productCategories)
      .get();

    // Skip if we already have product categories
    if (existingCategoriesCount && existingCategoriesCount.count > 0) {
      console.log("Product data already seeded. Skipping.");
      return;
    }

    // First, create our sample farmer if they don't exist
    let farmer = await db
      .select()
      .from(users)
      .where(eq(users.email, SAMPLE_FARMER_EMAIL))
      .get();

    let farmerId: string;

    if (!farmer) {
      // Create a sample farmer
      farmerId = uuidv4();
      const now = new Date().toISOString();

      // Create base user
      await db.insert(users).values({
        id: farmerId,
        email: SAMPLE_FARMER_EMAIL,
        passwordHash: "hashed_farmpassword",
        firstName: "John",
        lastName: "Appleseed",
        userType: "farmer",
        createdAt: now,
      });

      // Create farmer profile
      await db.insert(farmers).values({
        id: farmerId,
        farmName: "Green Valley Organic Farm",
        farmDescription:
          "A family-owned organic farm dedicated to sustainable farming practices.",
        farmAddress: "123 Farm Road",
        city: "Greenville",
        state: "CA",
        postalCode: "95432",
        phoneNumber: "555-123-4567",
        isOrganic: true,
        isNonGMO: true,
        isSustainable: true,
        isPastureRaised: false,
      });

      console.log("Created sample farmer for product catalog");
    } else {
      // Use the existing farmer
      farmerId = farmer.id;
    }

    // Create product categories
    const categories = [
      {
        id: uuidv4(),
        name: "Vegetables",
        description: "Fresh, locally grown vegetables",
      },
      {
        id: uuidv4(),
        name: "Fruits",
        description: "Seasonal, organic fruits",
      },
      {
        id: uuidv4(),
        name: "Dairy",
        description: "Farm-fresh dairy products",
      },
      {
        id: uuidv4(),
        name: "Meat",
        description: "Ethically raised meat products",
      },
      {
        id: uuidv4(),
        name: "Eggs",
        description: "Free-range, pasture-raised eggs",
      },
      {
        id: uuidv4(),
        name: "Honey & Preserves",
        description: "Local honey and homemade preserves",
      },
    ];

    for (const category of categories) {
      await db.insert(productCategories).values(category);
    }

    console.log("Created product categories");

    // Get the category IDs for reference
    const vegetablesId = categories[0].id;
    const fruitsId = categories[1].id;
    const dairyId = categories[2].id;
    const meatId = categories[3].id;
    const eggsId = categories[4].id;
    const honeyId = categories[5].id;

    // Create sample products
    const sampleProducts = [
      {
        id: uuidv4(),
        name: "Organic Tomatoes",
        description:
          "Vine-ripened organic tomatoes, perfect for salads or cooking.",
        price: 4.99,
        unit: "lb",
        imageUrl: "/images/product-placeholder.jpg",
        stock: 50,
        categoryId: vegetablesId,
        farmerId: farmerId,
        isOrganic: true,
        isNonGMO: true,
        isSustainable: true,
        isPastureRaised: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: "Free-Range Eggs",
        description:
          "Farm-fresh eggs from free-range, pasture-raised chickens.",
        price: 6.99,
        unit: "dozen",
        imageUrl: "/images/product-placeholder.jpg",
        stock: 30,
        categoryId: eggsId,
        farmerId: farmerId,
        isOrganic: true,
        isNonGMO: true,
        isSustainable: true,
        isPastureRaised: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: "Grass-Fed Beef",
        description:
          "100% grass-fed beef, raised without antibiotics or hormones.",
        price: 12.99,
        unit: "lb",
        imageUrl: "/images/product-placeholder.jpg",
        stock: 20,
        categoryId: meatId,
        farmerId: farmerId,
        isOrganic: true,
        isNonGMO: true,
        isSustainable: true,
        isPastureRaised: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: "Organic Spinach",
        description: "Tender and nutrient-rich organic spinach leaves.",
        price: 3.99,
        unit: "bunch",
        imageUrl: "/images/product-placeholder.jpg",
        stock: 40,
        categoryId: vegetablesId,
        farmerId: farmerId,
        isOrganic: true,
        isNonGMO: true,
        isSustainable: true,
        isPastureRaised: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: "Wildflower Honey",
        description: "Raw, unfiltered honey from local wildflower meadows.",
        price: 8.99,
        unit: "jar",
        imageUrl: "/images/product-placeholder.jpg",
        stock: 25,
        categoryId: honeyId,
        farmerId: farmerId,
        isOrganic: true,
        isNonGMO: true,
        isSustainable: true,
        isPastureRaised: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: "Artisan Cheese",
        description: "Handcrafted artisan cheese, aged to perfection.",
        price: 7.99,
        unit: "8oz",
        imageUrl: "/images/product-placeholder.jpg",
        stock: 15,
        categoryId: dairyId,
        farmerId: farmerId,
        isOrganic: true,
        isNonGMO: true,
        isSustainable: true,
        isPastureRaised: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: "Organic Apples",
        description: "Crisp and sweet organic apples, locally grown.",
        price: 2.99,
        unit: "lb",
        imageUrl: "/images/product-placeholder.jpg",
        stock: 60,
        categoryId: fruitsId,
        farmerId: farmerId,
        isOrganic: true,
        isNonGMO: true,
        isSustainable: true,
        isPastureRaised: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: "Fresh Herbs",
        description:
          "Aromatic fresh herbs, perfect for cooking and garnishing.",
        price: 2.49,
        unit: "bunch",
        imageUrl: "/images/product-placeholder.jpg",
        stock: 35,
        categoryId: vegetablesId,
        farmerId: farmerId,
        isOrganic: true,
        isNonGMO: true,
        isSustainable: true,
        isPastureRaised: false,
        createdAt: new Date().toISOString(),
      },
    ];

    for (const product of sampleProducts) {
      await db.insert(products).values(product);
    }

    console.log("Created sample products");
    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding product data:", error);
    throw error;
  }
}
