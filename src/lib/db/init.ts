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

    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        shipping_address TEXT,
        shipping_city TEXT,
        shipping_state TEXT,
        shipping_postal_code TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        farmer_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price_per_unit REAL NOT NULL,
        product_name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (farmer_id) REFERENCES farmers(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS farmer_revenue (
        id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        order_id TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS customer_analytics (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        total_orders INTEGER NOT NULL DEFAULT 0,
        total_spent REAL NOT NULL DEFAULT 0,
        first_order_date TEXT,
        last_order_date TEXT,
        preferred_categories TEXT,
        preferred_farmers TEXT,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS product_analytics (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        total_sold INTEGER NOT NULL DEFAULT 0,
        total_revenue REAL NOT NULL DEFAULT 0,
        last_sold_date TEXT,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error creating database tables:", error);
    throw error;
  }
}
