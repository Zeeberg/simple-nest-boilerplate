import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import { AppModule } from './modules/app/app.module';
import { setupSwagger } from './setup-swagger';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  app.enableCors();
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

  //const reflector = app.get(Reflector);

  //app.useGlobalFilters(new QueryFailedFilter(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  const configService = app.select(SharedModule).get(ApiConfigService);
  logger.debug(configService.nodeEnv);

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  try {
    await app.listen(configService.appConfig.port);
    logger.debug(`Server running on ${await app.getUrl()}`);
  } catch (error) {
    logger.error(`Application starting failed: ${JSON.stringify(error)}`);

    throw error;
  }
}

void bootstrap();
