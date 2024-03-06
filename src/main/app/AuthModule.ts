/*eslint-disable*/

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import AgencyAuthController from "./controllers/AgencyAuthController";
import AgentAuthService from "./services/AgentAuthService";
import AgentRepository from "./repositories/AgentRepository";
import AgentAuthRepository from "./repositories/AgentAuthRepository";
import { TypeOrmModule } from "@nestjs/typeorm";
import Agent from "./models/Agent";
import AgentAuth from "./models/AgentAuth";
import AgentAuthValidatorService from "./services/AgentAuthValidatorService";
import ApplicationEventStarter from "./event/ApplicationEventStarter";
import MicroserviceConfig from "./config/MicroserviceConfig";
import ApplicationLoggerMiddleware from "./middlewares/ApplicationLoggerMiddleware";
import ApplicationEventPublisher from "./event/ApplicationEventPublisher";

@Module({
  imports: [ TypeOrmModule.forFeature([Agent, AgentAuth ]), MicroserviceConfig.initWalletMicroServiceConfig()],
  providers: [
    AgentAuthService, AgentAuthValidatorService, AgentRepository,
    AgentAuthRepository, ApplicationEventStarter, ApplicationEventPublisher
  ],
  controllers: [AgencyAuthController]
})
export default class AuthModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(ApplicationLoggerMiddleware)
      .forRoutes({path: "/**", method: RequestMethod.ALL});
  }

}