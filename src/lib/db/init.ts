import { db } from "./index";

export async function initDatabase() {
  try {
    // Create users table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        user_type TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    // Create consumers table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS consumers (
        id TEXT PRIMARY KEY,
        address TEXT,
        city TEXT,
        state TEXT,
        postal_code TEXT,
        phone_number TEXT,
        FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create farmers table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS farmers (
        id TEXT PRIMARY KEY,
        farm_name TEXT NOT NULL,
        farm_description TEXT,
        farm_address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        is_organic INTEGER DEFAULT 0,
        is_non_gmo INTEGER DEFAULT 0,
        is_sustainable INTEGER DEFAULT 0,
        is_pasture_raised INTEGER DEFAULT 0,
        FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create product_categories table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS product_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
      )
    `);

    // Create products table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        unit TEXT NOT NULL,
        image_url TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        category_id TEXT,
        farmer_id TEXT NOT NULL,
        is_organic INTEGER DEFAULT 0,
        is_non_gmo INTEGER DEFAULT 0,
        is_sustainable INTEGER DEFAULT 0,
        is_pasture_raised INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES product_categories(id),
        FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
      )
    `);

    // Create cart_items table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error creating database tables:", error);
    throw error;
  }
}
