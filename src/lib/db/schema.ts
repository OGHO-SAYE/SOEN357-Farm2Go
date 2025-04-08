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
