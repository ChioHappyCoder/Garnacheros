import { Controller, Post, Delete, Param, Body, UseGuards, Request, HttpCode } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ClerkAuthGuard } from '../auth/clerk.guard';
import { Review } from '../common/types';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post(':spotId')
  @UseGuards(ClerkAuthGuard)
  async create(
    @Param('spotId') spotId: string,
    @Body() body: { rating: number; comment?: string },
    @Request() req: any,
  ): Promise<Review> {
    return this.reviewsService.create(
      parseInt(spotId, 10),
      req.auth.userId,
      body.rating,
      body.comment,
    );
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(ClerkAuthGuard)
  async delete(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<{ success: boolean }> {
    await this.reviewsService.delete(parseInt(id, 10), req.auth.userId);
    return { success: true };
  }
}
