import { Module } from '@nestjs/common';
import { SpotsModule } from './spots/spots.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { initDb } from './db/db';
import { createTables } from './db/schema';

@Module({
  imports: [DatabaseModule, SpotsModule, ReviewsModule],
  controllers: [AppController],
})
export class AppModule {
  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      await initDb();
      await createTables();
    } catch (error) {
      console.error('Failed to initialize database', error);
      process.exit(1);
    }
  }
}
