/*eslint-disable*/

import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import Environment from "./Environment";

export default class SwaggerDocConfig{

    public static initSwaggerDocConfiguration(app: INestApplication){
      const config = new DocumentBuilder()
        .setTitle("Agent Authentication/Authorization")
        .setDescription("Agent Authentication/Authorization server")
        .setVersion("1.0.0")
        .addBearerAuth()
        .addTag("")
        .build();
       const document = SwaggerModule.createDocument(app, config);
       SwaggerModule.setup(Environment.getProperty("swagger.doc.basePath"), app, document);
    }
}