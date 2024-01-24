import { MessageComponent } from "src/components/message.component";

import {
  MessageHandlerErrorBehavior,
  RabbitMQModule,
} from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { RabbitMQService } from "./rabbitmq.service";
import { Exchanges } from "src/constants/subscribe.const";

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: (configService: ConfigService) => {
        console.log("rabbit uri:", configService.get("rabbitmqUri"));
        return {
          uri: configService.get("rabbitmqUri"),
          exchanges: [
            {
              name: Exchanges.MAIN_X,
              type: "direct",
            },
            {
                name: Exchanges.WORKER_X,
                type: "direct",
              },
          ],
          defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.NACK,
          defaultRpcErrorBehavior: MessageHandlerErrorBehavior.NACK,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [MessageComponent, RabbitMQService],
  exports: [RabbitMQService, ConfigModule],
})
export class RabbitMQ {}
