import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { User } from './auth/entities/user.entity';

let cachedServer: INestApplication;

async function bootstrapServer(): Promise<INestApplication> {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);

    await nestApp.init();
    cachedServer = nestApp;
  }
  return cachedServer;
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  cachedServer = await bootstrapServer();

  // Inicializar lambda consumer sqs
  if (event.Records) {
    const handler = cachedServer.get(AuthService);
    const body = JSON.parse(event.Records[0].body);
    const users = JSON.parse(body.Message);
    return handler.handleMessage(users as User[]);
  }

  // Inicializar lambda http
  const expressApp = cachedServer.getHttpAdapter().getInstance();
  const server = serverlessExpress({ app: expressApp });
  return server(event, context, callback);
};
