/*eslint-disable*/

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import AuthModule from "./main/app/AuthModule";
import DatasourceConfig from "./main/app/config/DatasourceConfig";
import ApplicationLoggerMiddleware from "./main/app/middlewares/ApplicationLoggerMiddleware";

@Module({
  imports: [DatasourceConfig.InitSQLDatasourceConfiguration(), AuthModule],
  providers: [ApplicationLoggerMiddleware]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(ApplicationLoggerMiddleware)
      .forRoutes({path: "/**", method: RequestMethod.ALL});
  }
}
