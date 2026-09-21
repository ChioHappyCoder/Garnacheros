import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost',
    'http://localhost:5173',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`✓ Server running on http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
