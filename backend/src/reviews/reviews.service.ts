import { Inject, Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_CONNECTION } from '../database/database.provider';
import { Review } from '../common/types';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(DATABASE_CONNECTION) private pool: Pool,
  ) {}

  async create(spotId: number, userId: string, rating: number, comment?: string): Promise<Review> {
    if (!rating || rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const result = await this.pool.query(
      `INSERT INTO reviews (spot_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [spotId, userId, rating, comment || null],
    );

    return result.rows[0];
  }

  async delete(id: number, userId: string): Promise<void> {
    const reviewResult = await this.pool.query(
      `SELECT user_id FROM reviews WHERE id = $1`,
      [id],
    );

    if (reviewResult.rows.length === 0) {
      throw new NotFoundException('Review not found');
    }

    if (reviewResult.rows[0].user_id !== userId) {
      throw new ForbiddenException('Cannot delete review');
    }

    await this.pool.query(`DELETE FROM reviews WHERE id = $1`, [id]);
  }
}
