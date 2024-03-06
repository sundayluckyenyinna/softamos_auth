/*eslint-disable*/

import { HttpStatus, Injectable } from "@nestjs/common";
import Agent from "../models/Agent";
import ApiException from "../exceptions/ApiException";
import { AgentLoginRequest } from "../payloads/RequestPayload";
import PasswordUtil from "../utils/PasswordUtil";
import AgentRepository from "../repositories/AgentRepository";
import AgentAuthRepository from "../repositories/AgentAuthRepository";

@Injectable()
export default class AgentAuthValidatorService{

  constructor(
     private readonly agentRepository: AgentRepository,
     private readonly agentAuthRepository: AgentAuthRepository
  ) {}

  public async validateExistingDataForSignup(username: string, email: string, mobileNumber: string): Promise<void> {
    const conflictHttpCode: number = HttpStatus.CONFLICT;
    let existingAgent: Agent = await this.agentRepository.findOne({ where: { username: username }});
    if(existingAgent){
      ApiException.throwNewInstance(conflictHttpCode, "Username already exists!");
    }
    existingAgent = await this.agentRepository.findOne({ where: { emailAddress: email }});
    if(existingAgent){
      ApiException.throwNewInstance(conflictHttpCode, "Email already exists!")
    }
    existingAgent = await this.agentRepository.findOne({ where: { mobileNumber: mobileNumber }});
    if(existingAgent){
      ApiException.throwNewInstance(conflictHttpCode, "Mobile number already exists!");
    }
  }

  public async validateAgentForLogin(requestPayload: AgentLoginRequest): Promise<Agent> {
    const existingAgent: Agent = await this.agentRepository.findOne({ where: { mobileNumber: requestPayload.mobileNumber }});
    if(!existingAgent){
      ApiException.throwNewInstance(HttpStatus.NOT_FOUND, `Agent with mobileNumber ${requestPayload.mobileNumber} cannot be found`);
    }
    const isPasswordMatch: boolean = PasswordUtil.match(requestPayload.password, existingAgent.password);
    if(!isPasswordMatch){
      ApiException.throwNewInstance(HttpStatus.UNAUTHORIZED, `Invalid password`);
    }
    return Promise.resolve(existingAgent);
  }
}