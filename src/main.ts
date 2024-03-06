/*eslint-disable*/

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from "@nestjs/common";
import Environment from "./main/app/config/Environment";
import SwaggerDocConfig from "./main/app/config/SwaggerDocConfig";
import GlobalAppConfig from "./main/app/config/GlobalAppConfig";



async function bootstrap(): Promise<void> {
  const PORT: number = Number(Environment.getProperty("server.port")) || 1000;
  const logger: Logger = new Logger("AgentAuthorizationApplication");

  Environment.loadPropertiesOrFail();
  const app: INestApplication = await NestFactory.create(AppModule);
  SwaggerDocConfig.initSwaggerDocConfiguration(app);
  GlobalAppConfig.initGlobalApplicationConfig(app);
  await app.listen(PORT, () => {
     logger.log(`AgentAuthorizationApplication started on port ${PORT}`);
  });
}

bootstrap();
