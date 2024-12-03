import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { envs } from './config';


async function bootstrap() {

  const logger = new Logger('Main')
  
  console.log(envs.natsServers);
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>( // createMicroservice recibe como primer argumento el AppModule y luego un objeto con el tipo de transporte que usemos y sus respectivas opciones.
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers
      }
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
    );

  await app.listen();
  logger.log(`Products Microservice running on port ${ envs.port }`)  
}
bootstrap();
