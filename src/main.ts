import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger("Main");
  const app = await NestFactory.create(AppModule);

  //Ayuda validad que el cuerpo del body venga como yo le estoy pidiendo en mi dto con ayuda del class-validator
  app.useGlobalPipes( 
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
 
  await app.listen(envs.port);
  logger.log(`PORT: ${ envs.port }`);
}
bootstrap();
