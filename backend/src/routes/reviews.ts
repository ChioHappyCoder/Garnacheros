import { Router, Request, Response } from "express";
import { query } from "../db/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/:spotId", requireAuth, async (req: Request, res: Response) => {
  try {
    const { spotId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.auth?.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const result = await query(
      `INSERT INTO reviews (spot_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [spotId, userId, rating, comment || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create review" });
  }
});

router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.auth?.userId;

    const review = await query(
      `SELECT user_id FROM reviews WHERE id = $1`,
      [id]
    );

    if (review.rows.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.rows[0].user_id !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await query(`DELETE FROM reviews WHERE id = $1`, [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

export default router;
