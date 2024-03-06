/*eslint-disable*/

import { DynamicModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import Environment from "./Environment";

export default class MicroserviceConfig{

   public static initWalletMicroServiceConfig() : DynamicModule {
      return ClientsModule.register([{
        name: Environment.getProperty("microservice.config.wallet.name"),
        transport: Transport.TCP,
        options: {
           port: Number(Environment.getProperty("microservice.config.wallet.port"))
        }
      }]);
   }
}