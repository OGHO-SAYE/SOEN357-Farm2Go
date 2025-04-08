import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { join } from "path";
import { initDatabase } from "./init";
import { seedProductData } from "./seed";

// Initialize SQLite database
const sqlite = new Database(join(process.cwd(), "farm2go.db"));
export const db = drizzle(sqlite, { schema });

// Initialize database tables and seed data
const setupDatabase = async () => {
  try {
    // Create database tables
    await initDatabase();

    // Seed product data
    await seedProductData();
  } catch (error) {
    console.error("Database setup error:", error);
  }
};

setupDatabase().catch(console.error);
