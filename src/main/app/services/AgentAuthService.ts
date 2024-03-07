/*eslint-disable*/

import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import AgentRepository from "../repositories/AgentRepository";
import AgentAuthRepository from "../repositories/AgentAuthRepository";
import { AgentLoginRequest, CreateAgentRequest } from "../payloads/RequestPayload";
import { AgentLoginResponseData, ApiResponse } from "../payloads/ResponsePayload";
import Agent from "../models/Agent";
import ApiException from "../exceptions/ApiException";
import AppHelper from "../utils/AppHelper";
import Environment from "../config/Environment";
import { AgentStatus } from "../commons/AgentStatus";
import PasswordUtil from "../utils/PasswordUtil";
import AgentAuth from "../models/AgentAuth";
import JwtTokenUtil, { GenerateTokenRequestData } from "../utils/JwtTokenUtil";
import { EntityManager } from 'typeorm';
import AgentAuthValidatorService from "./AgentAuthValidatorService";
import ApplicationEventPublisher from "../event/ApplicationEventPublisher";


@Injectable()
export default class AgentAuthService {

  private logger: Logger = new Logger(AgentAuthService.name);

  constructor(
    private readonly agentRepository: AgentRepository,
    private readonly agentAuthRepository: AgentAuthRepository,
    private readonly agentAuthValidatorService: AgentAuthValidatorService,
    private readonly appEventPublisher: ApplicationEventPublisher
  )
  {}


   public async processAgentSignup(requestPayload: CreateAgentRequest): Promise<ApiResponse<AgentLoginResponseData>> {
      await this.agentAuthValidatorService.validateExistingDataForSignup(requestPayload.username, requestPayload.emailAddress, requestPayload.mobileNumber);
      const agent: Agent = this.buildNewAgent(requestPayload);
      const agentAuth: AgentAuth = this.buildNewAgentAuth(agent);
      const persistedAgent: Agent = await this.persistAgentAndAgentAuthRecordAtomically(agent, agentAuth);
      const responseData: AgentLoginResponseData = AgentLoginResponseData.from({
         username: persistedAgent.username, emailAddress: persistedAgent.emailAddress, mobileNumber: persistedAgent.mobileNumber
      });
      this.logger.log('Successful agent creation');
      this.appEventPublisher.publishAgentWalletCreationRequest(agent);
      return Promise.resolve(new ApiResponse(HttpStatus.OK, "Successful agent creation", responseData));
   }


   public async processAgentLogin(requestPayload: AgentLoginRequest): Promise<ApiResponse<AgentLoginResponseData>>{
      const existingAgent: Agent = await this.agentAuthValidatorService.validateAgentForLogin(requestPayload);
      const renewedAgentAuth: AgentAuth = await this.reNewAgentAuth(existingAgent);
      const responseData: AgentLoginResponseData = AgentLoginResponseData.from({
          username: existingAgent.username, emailAddress: existingAgent.emailAddress,
          mobileNumber: existingAgent.mobileNumber, accessToken: renewedAgentAuth.authToken
       });
      this.logger.log('Successful agent login');
      this.appEventPublisher.publishAgentAccountCreationRequest(existingAgent);
      return Promise.resolve(new ApiResponse(HttpStatus.OK, "Successful agent login", responseData));
   }


   private async persistAgentAndAgentAuthRecordAtomically(agent: Agent, agentAuth: AgentAuth): Promise<Agent> {
      try {
        return this.agentRepository.manager.transaction(async (entityManager: EntityManager): Promise<Agent> => {
          const createdAgent: Agent = await this.agentRepository.save(agent);
          await this.agentAuthRepository.save(agentAuth);
          return createdAgent;
        });
      }catch (error){
        ApiException.throwNewInstance(HttpStatus.INTERNAL_SERVER_ERROR, error);
      }
   }

   private buildNewAgent(requestPayload: CreateAgentRequest): Agent {
       const newAgent: Agent = new Agent();
       newAgent.agentId = AppHelper.generateSequence(Number(Environment.getProperty("identity.sequence.length") || 12));
       newAgent.slug = AppHelper.generateUUID();
       newAgent.username = requestPayload.username;
       newAgent.mobileNumber = requestPayload.mobileNumber;
       newAgent.emailAddress = requestPayload.emailAddress;
       newAgent.status = AgentStatus.ACTIVE;
       newAgent.state = requestPayload.state;
       newAgent.city = requestPayload.city;
       newAgent.locationAddress = requestPayload.locationAddress;
       newAgent.password = PasswordUtil.hash(requestPayload.password);
       newAgent.createdAt = new Date();
       newAgent.updatedAt = newAgent.createdAt;
       return newAgent;
   }

   private buildNewAgentAuth(newAgent: Agent): AgentAuth {
      const agentAuth: AgentAuth = new AgentAuth();
      agentAuth.agent = newAgent;
      agentAuth.authToken = this.generateAgentAuthToken(newAgent);
      agentAuth.createdAt = new Date();
      agentAuth.updatedAt = agentAuth.createdAt;
      return agentAuth;
   }

   private generateAgentAuthToken(agent: Agent): string {
     const authData: GenerateTokenRequestData = {
       emailAddress: agent.emailAddress,
       mobileNumber: agent.mobileNumber,
       username: agent.username
     }
     const token: string = JwtTokenUtil.generateToken(authData);
     return token;
   }

   private async reNewAgentAuth(agent: Agent): Promise<AgentAuth> {
       const newToken: string = this.generateAgentAuthToken(agent);
       const agentAuth: AgentAuth = await this.agentAuthRepository.findOne({ where: { agent: agent }});
       if(!agentAuth){
         ApiException.throwNewInstance(HttpStatus.NOT_FOUND, "Could not find agent security record!");
       }
       agentAuth.authToken = newToken;
       return this.agentAuthRepository.save(agentAuth);
   }

}