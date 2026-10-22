import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  // Explicit loopback binding: this exercise must not be publicly deployed.
  await app.listen(3001, '127.0.0.1');
}
bootstrap().catch(error => { console.error(error); process.exitCode = 1; });
