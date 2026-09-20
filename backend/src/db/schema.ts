import { query } from "./db.js";

export async function createTables() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS spots (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        address VARCHAR(255) NOT NULL,
        colonia VARCHAR(100),
        food_type VARCHAR(100),
        hours VARCHAR(100),
        description TEXT,
        image_url VARCHAR(255),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        spot_id INT NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
        user_id VARCHAR(255) NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`CREATE INDEX IF NOT EXISTS idx_reviews_spot_id ON reviews(spot_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_spots_city ON spots(city)`);

    console.log("✓ Tables created/verified");
  } catch (error) {
    console.error("✗ Schema creation failed", error);
    throw error;
  }
}
