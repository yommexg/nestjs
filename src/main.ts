import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn', 'log'],
    // bufferLogs: true,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // app.useLogger(app.get(LoggerService));
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
  console.log('Application is running on port', process.env.PORT ?? 3000);
}

void bootstrap();
