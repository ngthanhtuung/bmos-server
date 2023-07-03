import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as firebaseAdmin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'],
    cors: true
  })

  const configService = app.get(ConfigService)

  const port: number = configService.get('PORT');
  const pathOpenApi: string = configService.get('PATH_OPEN_API');
  const server_host: string = configService.get('SERVER_HOST');
  app.setGlobalPrefix(pathOpenApi);

  // setup CORS
  app.enableCors({
    credentials: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    origin: '*',
    exposedHeaders: ['Set-Cookie'],
  });
  // end setup CORS


  // setup firebase

  // setup config option
  const firebaseConfig: ServiceAccount = {
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    privateKey: configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      .replace(/\\n/g, '\n'),
    clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  };


  // initialize the firebase admin app
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseConfig),
  });

  //end set up firebase

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle('Bird Meal Order System')
    .setDescription('The app provide all products and services for bird meal order system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(pathOpenApi, app, document);
  // end seup swagger

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running at ${server_host}:${port}/${pathOpenApi}`);
  });
}
bootstrap();
