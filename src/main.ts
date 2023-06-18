import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import DB from '../DatabaseModule';
import { DatabaseTypes } from '../DatabaseModule/databases/database';

async function bootstrap() {
  DB.setting({ DB_NAME: 'db', DB_TYPE: DatabaseTypes.JSON });

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(4000);
}
bootstrap();
