import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { SpotsService } from './spots.service';
import { Spot, SpotDetail } from '../common/types';

@Controller('api/spots')
export class SpotsController {
  constructor(private spotsService: SpotsService) {}

  @Get()
  async findAll(
    @Query('city') city?: string,
    @Query('search') search?: string,
  ): Promise<Spot[]> {
    return this.spotsService.findAll(city, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SpotDetail> {
    const spot = await this.spotsService.findOne(parseInt(id, 10));
    if (!spot) {
      throw new NotFoundException('Spot not found');
    }
    return spot;
  }
}
