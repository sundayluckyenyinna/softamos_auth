/*eslint-disable*/

import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags
} from "@nestjs/swagger";
import {
  AgentLoginResponseData,
  ApiResponse,
  BadRequestPayload,
  InternalServerError
} from "../payloads/ResponsePayload";
import { AgentLoginRequest, CreateAgentRequest } from "../payloads/RequestPayload";
import AgentAuthService from "../services/AgentAuthService";



@ApiTags('Agent Authentication/Authorization server')
@ApiBadRequestResponse({ description: "Bad request response", status: HttpStatus.BAD_REQUEST, type: BadRequestPayload })
@ApiCreatedResponse({ status: HttpStatus.CREATED })
@ApiInternalServerErrorResponse({ description: "Server error",  type: InternalServerError })
@ApiBearerAuth()
@Controller({ path: '/auth/agents'})
export default class AgencyAuthController{


  constructor(private readonly agentAuthService: AgentAuthService) {

  }

  @Post('/signup')
  @ApiOperation({ description: "This API is used to sign-up new agents"})
  @ApiOkResponse({description: "Successful response", status: 200, type: ApiResponse<AgentLoginResponseData>})
  async handleAgentCreation(@Body() requestPayload: CreateAgentRequest): Promise<ApiResponse<AgentLoginResponseData>>{
      return Promise.resolve(this.agentAuthService.processAgentSignup(requestPayload));
  }


  @Post('/login')
  @ApiOperation({ description: "This API is used to process agent login request"})
  @ApiOkResponse({description: "Successful response", status: HttpStatus.OK, type: ApiResponse<AgentLoginResponseData>})
  async handleAgentLoginRequest(@Body() requestPayload: AgentLoginRequest): Promise<ApiResponse<AgentLoginResponseData>>{
    return Promise.resolve(this.agentAuthService.processAgentLogin(requestPayload));
  }
}