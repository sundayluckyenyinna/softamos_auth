/*eslint-disable*/

import { ClientProxy } from "@nestjs/microservices";
import { Inject, Injectable } from "@nestjs/common";
import Environment from "../config/Environment";
import Agent from "../models/Agent";
import MessagePatternCommand from "./MessagePatternCommand";
import { Currency } from "../commons/Currency";

@Injectable()
export default class ApplicationEventPublisher{

   constructor(@Inject(Environment.getProperty("microservice.config.wallet.name")) private readonly client: ClientProxy) {
   }

   public publishAgentWalletCreationRequest(agent: Agent): void {
      const pattern = { cmd: MessagePatternCommand.CREATE_WALLET };
      const message = { agentMobileNumber: agent.mobileNumber, currency: Currency.NGN }
      this.client.send(pattern, message).toPromise();
   }

   public publishAgentAccountCreationRequest(agent: Agent): void {
      const pattern = { cmd: MessagePatternCommand.CREATE_VIRTUAL_ACCOUNT };
      const message = { agentMobileNumber: agent.mobileNumber, preferredName: agent.username }
      this.client.send(pattern, message).toPromise();
   }
}