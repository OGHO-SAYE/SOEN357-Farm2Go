import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Base users table
export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  userType: text("user_type", { enum: ["consumer", "farmer"] }).notNull(),
  createdAt: text("created_at").notNull(),
});

// Consumers table - extends users
export const consumers = sqliteTable("consumers", {
  id: text("id")
    .notNull()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  phoneNumber: text("phone_number"),
});

// Farmers table - extends users
export const farmers = sqliteTable("farmers", {
  id: text("id")
    .notNull()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  farmName: text("farm_name").notNull(),
  farmDescription: text("farm_description"),
  farmAddress: text("farm_address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  phoneNumber: text("phone_number").notNull(),
  isOrganic: integer("is_organic", { mode: "boolean" }).default(false),
  isNonGMO: integer("is_non_gmo", { mode: "boolean" }).default(false),
  isSustainable: integer("is_sustainable", { mode: "boolean" }).default(false),
  isPastureRaised: integer("is_pasture_raised", { mode: "boolean" }).default(
    false
  ),
});

// Product Categories
export const productCategories = sqliteTable("product_categories", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

// Products schema
export const products = sqliteTable("products", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  unit: text("unit").notNull(), // e.g., lb, each, dozen
  imageUrl: text("image_url").notNull(),
  stock: integer("stock").notNull().default(0),
  categoryId: text("category_id").references(() => productCategories.id),
  farmerId: text("farmer_id")
    .notNull()
    .references(() => farmers.id, { onDelete: "cascade" }),
  isOrganic: integer("is_organic", { mode: "boolean" }).default(false),
  isNonGMO: integer("is_non_gmo", { mode: "boolean" }).default(false),
  isSustainable: integer("is_sustainable", { mode: "boolean" }).default(false),
  isPastureRaised: integer("is_pasture_raised", { mode: "boolean" }).default(
    false
  ),
  createdAt: text("created_at").notNull(),
});

// Cart items schema
export const cartItems = sqliteTable("cart_items", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: text("created_at").notNull(),
});

// Orders schema
export const orders = sqliteTable("orders", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  total: real("total").notNull(),
  status: text("status", {
    enum: ["pending", "processing", "completed", "cancelled"],
  })
    .notNull()
    .default("pending"),
  shippingAddress: text("shipping_address"),
  shippingCity: text("shipping_city"),
  shippingState: text("shipping_state"),
  shippingPostalCode: text("shipping_postal_code"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Order items schema - connects orders to products
export const orderItems = sqliteTable("order_items", {
  id: text("id").notNull().primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  farmerId: text("farmer_id")
    .notNull()
    .references(() => farmers.id),
  quantity: integer("quantity").notNull(),
  pricePerUnit: real("price_per_unit").notNull(), // Store price at time of purchase
  productName: text("product_name").notNull(), // Store product name at time of purchase
  createdAt: text("created_at").notNull(),
});

// Revenue tracking for farmers
export const farmerRevenue = sqliteTable("farmer_revenue", {
  id: text("id").notNull().primaryKey(),
  farmerId: text("farmer_id")
    .notNull()
    .references(() => farmers.id, { onDelete: "cascade" }),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  amount: real("amount").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format for easier querying by date
  createdAt: text("created_at").notNull(),
});

// Customer analytics schema
export const customerAnalytics = sqliteTable("customer_analytics", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  totalOrders: integer("total_orders").notNull().default(0),
  totalSpent: real("total_spent").notNull().default(0),
  firstOrderDate: text("first_order_date"),
  lastOrderDate: text("last_order_date"),
  preferredCategories: text("preferred_categories"), // JSON stringified array of category IDs
  preferredFarmers: text("preferred_farmers"), // JSON stringified array of farmer IDs
  updatedAt: text("updated_at").notNull(),
});

// Product analytics schema
export const productAnalytics = sqliteTable("product_analytics", {
  id: text("id").notNull().primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  totalSold: integer("total_sold").notNull().default(0),
  totalRevenue: real("total_revenue").notNull().default(0),
  lastSoldDate: text("last_sold_date"),
  updatedAt: text("updated_at").notNull(),
});
