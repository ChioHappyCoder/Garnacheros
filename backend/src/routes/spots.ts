import { Router, Request, Response } from "express";
import { query } from "../db/db.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { city, search } = req.query;
    let sql = `
      SELECT s.*,
             ROUND(AVG(r.rating)::numeric, 1) as avg_rating,
             COUNT(r.id) as review_count
      FROM spots s
      LEFT JOIN reviews r ON s.id = r.spot_id
    `;
    const params: unknown[] = [];

    if (city && city !== "all") {
      sql += ` WHERE s.city = $${params.length + 1}`;
      params.push(city);
    }

    if (search) {
      const searchTerm = `%${search}%`;
      const condition = `s.name ILIKE $${params.length + 1} OR s.food_type ILIKE $${params.length + 2} OR s.colonia ILIKE $${params.length + 3}`;
      sql += params.length > 0 ? ` AND (${condition})` : ` WHERE (${condition})`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ` GROUP BY s.id ORDER BY avg_rating DESC NULLS LAST, s.created_at DESC`;

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch spots" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const spot = await query(
      `SELECT s.*,
              ROUND(AVG(r.rating)::numeric, 1) as avg_rating,
              COUNT(r.id) as review_count
       FROM spots s
       LEFT JOIN reviews r ON s.id = r.spot_id
       WHERE s.id = $1
       GROUP BY s.id`,
      [id]
    );

    if (spot.rows.length === 0) {
      return res.status(404).json({ error: "Spot not found" });
    }

    const reviews = await query(
      `SELECT id, user_id, rating, comment, created_at
       FROM reviews
       WHERE spot_id = $1
       ORDER BY created_at DESC`,
      [id]
    );

    res.json({
      ...spot.rows[0],
      reviews: reviews.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch spot" });
  }
});

export default router;
