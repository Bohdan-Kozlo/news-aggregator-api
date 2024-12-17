import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from './common/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await isPrismaConnectedToDatabase(app);
  app.use(cookieParser());

  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

async function isPrismaConnectedToDatabase(app: INestApplication) {
  const prismaService = app.get(PrismaService);
  try {
    await prismaService.$connect();
    console.log('✅ Database connection successful, starting the server...');
  } catch (error) {
    console.error(
      '❌ Cannot start the server due to database connection error:',
      error.message,
    );
    process.exit(1);
  }
}
