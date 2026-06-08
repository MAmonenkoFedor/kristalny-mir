import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';
import { UPLOADS_DIR } from './uploads/uploads.controller';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // папка для загруженных изображений
  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  app.useStaticAssets(UPLOADS_DIR, { prefix: '/uploads/' });

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN?.split(',') ?? 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT ?? 4000);
  // На хостинге (ISPmanager, режим «Порт») панель передаёт хост в INSTANCE_HOST.
  const host = process.env.INSTANCE_HOST || '0.0.0.0';
  await app.listen(port, host);
  Logger.log(`API запущен на http://${host}:${port}`, 'Bootstrap');
}

bootstrap();
