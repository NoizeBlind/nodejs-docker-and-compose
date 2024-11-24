import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: () => {
        return new BadRequestException('Ошибка валидации');
      },
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
