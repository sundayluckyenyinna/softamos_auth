/*eslint-disable*/

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";


export class CreateAgentRequest {
   @ApiProperty({ type: String, description: `Agent's username`, required: true })
   username: string;

   @ApiProperty({ type: String, description: `Agent's mobile number`, required: true })
   mobileNumber: string;

   @ApiProperty({ type: String, description: `Agent's emailAddress`, required: true })
   @IsEmail()
   emailAddress: string;

   @ApiProperty({ type: String, description: `Agent's password`, required: true })
   password: string;

   @ApiProperty({ type: String, description: `Agent's state of operation`, required: true })
   state: string;

   @ApiProperty({ type: String, description: `Agent's city of operation`, required: true })
   city: string;

   @ApiProperty({ type: String, description: `Agent's address of operation`, required: true })
   locationAddress: string;
}


export class AgentLoginRequest{
   @ApiProperty({ type: String, description: `Agent's mobile number`, required: true })
   mobileNumber: string;

   @ApiProperty({ type: String, description: `Agent's password`, required: true })
   password: string;
}
