import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { logger } from './utils/logger/index';
import * as compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { urlencoded } from 'express';
// import admin, { ServiceAccount } from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors({
    origin: '*',
    allowedHeaders: [
      'Content-Type, Access-Control-Allow-Origin, x-access-token, Accept',
    ],
    methods: 'POST,GET,PUT,PATCH,DELETE',
  });
  app.use(compression());
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      whitelist: true,
    }),
  );
  app.use(urlencoded({ extended: true }));
  app.use(helmet.frameguard({ action: 'sameorigin' }));
  app.setGlobalPrefix('api');
  // const adminConfig: ServiceAccount = configService.get('firebaseConfig');
  // admin.initializeApp({
  //   credential: admin.credential.cert(adminConfig),
  // });
  const port = app.get(ConfigService).get('port');
  await app.listen(port);
  logger.info(`O2A-BACKEND IS RUNNING ON PORT ${port}: ${await app.getUrl()}`);
}
bootstrap();
