import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? ['https://pika-apuri-backend.onrender.com'] // Production URL
      : ['http://localhost:3000']; // Local development URL
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
