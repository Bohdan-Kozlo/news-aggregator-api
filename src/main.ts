import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './common/prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  await isPrismaConnectedToDatabase(app);
  app.use(cookieParser());

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('News Aggregator API')
    .setDescription('API documentation for the News Aggregator project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

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
