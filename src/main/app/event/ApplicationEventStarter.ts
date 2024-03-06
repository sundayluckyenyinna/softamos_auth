/*eslint-disable*/


import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import Environment from "../config/Environment";

@Injectable()
export default class ApplicationEventStarter implements OnApplicationBootstrap{

  public static WALLET_SERVICE_NAME: string = Environment.getProperty("microservice.config.wallet.name");
  public static WALLET_SERVICE_PORT: string = Environment.getProperty("microservice.config.wallet.name");

  constructor(@Inject(ApplicationEventStarter.WALLET_SERVICE_NAME) private client: ClientProxy) {
  }

  async onApplicationBootstrap(): Promise<any> {
    this.client.connect()
      .then(() => {
        console.log(`Wallet microservice connected on TCP with port ${ApplicationEventStarter.WALLET_SERVICE_PORT}`);
      });
  }

}