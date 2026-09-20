import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error("Database error", error);
    throw error;
  }
}

export async function initDb() {
  try {
    await pool.query("SELECT 1");
    console.log("✓ Database connected");
  } catch (error) {
    console.error("✗ Database connection failed", error);
    throw error;
  }
}

export default pool;
