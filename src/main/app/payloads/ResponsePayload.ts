/*eslint-disable*/

import { ApiProperty } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";

export class BaseResponse{

   @ApiProperty({ name: "code", description: "Response code", default: HttpStatus.OK })
   code: number;

   @ApiProperty({ name: "message", description: "Response message"})
   message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }

}

export class ApiResponse<T> extends BaseResponse{

  @ApiProperty({ name: "data", description: "Response data" })
   data: T | undefined;

  constructor(code: number, message: string, data: T | undefined) {
    super(code, message);
    this.data = data;
  }
}

export class AgentLoginResponseData{
   @ApiProperty({ name: "mobileNumber", description: "Agent registered mobile number" })
   mobileNumber: string;

   @ApiProperty({ name: "username", description: "Agent registered username" })
   username: string;

   @ApiProperty({ name: "emailAddress", description: "Agent registered email address" })
   emailAddress: string;

   @ApiProperty({ name: "status", description: "Agent registered status" })
   status: string;

  @ApiProperty({ name: "accessToken", description: "Agent access token", required: false })
   accessToken: string;

   public static from(data: { username: string, emailAddress: string, mobileNumber: string, accessToken?: string}):AgentLoginResponseData{
      const object: AgentLoginResponseData = new AgentLoginResponseData();
      object.username = data.username;
      object.emailAddress = data.emailAddress;
      object.mobileNumber = data.mobileNumber;
      object.accessToken = data.accessToken;
      return object;
   }
}


export class BadRequestPayload{
   @ApiProperty({ name: "code", description: "response code", default: HttpStatus.BAD_REQUEST, type: Number })
   private code: number;

   @ApiProperty({ name: "response message", default: "Email must be a valid email", example: "Email must be a valid email", type: String })
   private message: string;
}


export class InternalServerError{
  @ApiProperty({ name: "code", description: "response code", default: HttpStatus.INTERNAL_SERVER_ERROR, type: Number })
  private code: number;

  @ApiProperty({ name: "response message", default: "Internal server error", example: "Internal server error", type: String })
  private message: string;
}