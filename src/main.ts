import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(morgan('combined'));
  app.use(compression());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.enableVersioning();

  try {
    await app.listen(3000);
    logger.debug(`Server running on ${await app.getUrl()}`);
  } catch (error) {
    logger.error(`Application starting failed: ${JSON.stringify(error)}`);

    throw error;
  }
}

void bootstrap();
