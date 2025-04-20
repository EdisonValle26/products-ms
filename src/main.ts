import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger("Main");

  //Lo transformamos a un Microservicio
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.port
      }
    }
  );

  //Ayuda validar que el cuerpo del body venga como yo le estoy pidiendo en mi dto con ayuda del class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
 
  await app.listen();
  logger.log(`Products Microservices running on PORT: ${ envs.port }`);
}
bootstrap();
