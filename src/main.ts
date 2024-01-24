import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { MessageComponent } from "./components/message.component";
import { LoggerModule } from "./logger/logger.module";
import { RolesGuard } from "./validators/roles.guard";
import { ValidationPipe422 } from "./validators/validation-pipe-tranform.validate";
import { contentParser } from "fastify-multer";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  //   app.connectMicroservice<MicroserviceOptions>({
  //     transport: Transport.TCP,
  //     options: {
  //       port: 3000,
  //     },
  //   });

  MessageComponent.init();
  const configService = app.get(ConfigService);
  const port = String(configService.get("PORT") ?? 3000);

  const config = new DocumentBuilder()
    .setTitle("X API")
    .setVersion("1.0")
    .addBearerAuth()
    .addServer(
      `http://localhost:${port}/main/${configService.get("apiPrefix")}`,
    )
    .addServer(
      `https://botx-test.bitswap.space/main/${configService.get("apiPrefix")}`,
    )
    .addServer(
        `https://api.xspeeder.shop/main/${configService.get("apiPrefix")}`,
      )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  app.register(contentParser);
  app.useStaticAssets({ root: join(__dirname, "../../public") });

  app.useGlobalPipes(new ValidationPipe422({ whitelist: true }));
  app.setGlobalPrefix(`main/${configService.get("apiPrefix")}`);
  app.useGlobalGuards(new RolesGuard(new Reflector()));

  app.useLogger(LoggerModule.LogLevel(configService.get("logLevel")));

  await app.startAllMicroservices();
  await app.listen(port, "0.0.0.0");

  console.log(`APP IS RUNNING ON PORT ${await app.getUrl()}`);
}

void bootstrap();
