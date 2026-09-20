import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_CONNECTION } from '../database/database.provider';
import { Spot, SpotDetail } from '../common/types';

@Injectable()
export class SpotsService {
  constructor(
    @Inject(DATABASE_CONNECTION) private pool: Pool,
  ) {}

  async findAll(city?: string, search?: string): Promise<Spot[]> {
    let sql = `
      SELECT s.*,
             ROUND(AVG(r.rating)::numeric, 1) as avg_rating,
             COUNT(r.id) as review_count
      FROM spots s
      LEFT JOIN reviews r ON s.id = r.spot_id
    `;
    const params: unknown[] = [];

    if (city && city !== 'all') {
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

    const result = await this.pool.query(sql, params);
    return result.rows;
  }

  async findOne(id: number): Promise<SpotDetail> {
    const spotResult = await this.pool.query(
      `SELECT s.*,
              ROUND(AVG(r.rating)::numeric, 1) as avg_rating,
              COUNT(r.id) as review_count
       FROM spots s
       LEFT JOIN reviews r ON s.id = r.spot_id
       WHERE s.id = $1
       GROUP BY s.id`,
      [id],
    );

    if (spotResult.rows.length === 0) {
      return null;
    }

    const reviewsResult = await this.pool.query(
      `SELECT id, user_id, rating, comment, created_at
       FROM reviews
       WHERE spot_id = $1
       ORDER BY created_at DESC`,
      [id],
    );

    return {
      ...spotResult.rows[0],
      reviews: reviewsResult.rows,
    };
  }
}
