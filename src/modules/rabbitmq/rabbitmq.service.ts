import { plainToClass } from "class-transformer";
import { MessageComponent } from "src/components/message.component";

import { currentTimestamp } from "src/utils/general.util";

import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";


import { MessageData } from "./dto/message-data.dto";
import { Platform } from "src/enums/app.enum";
import { Exchanges, RoutingKeys } from "src/constants/subscribe.const";
import { MessageRabbitDto } from "src/dtos/message.rabbit.dto";

@Injectable()
export class RabbitMQService {
    constructor(
        private readonly amqpConnection: AmqpConnection,
        private i18n: MessageComponent,
    ) {
    }

    /**
     * @param  {Platform} platform
     * @param  {string} content
     * @param  {Record<string} data
     * @param  {Record<string, unknown>} unknown>=null
     * @param  {string[]|null=null} userIds
     * @param  {string=Exchanges.NOTIFICATION} exchange
     * @param  {string=RoutingKeys.NOTIFICATION_SEND} routingKey
     * @returns Promise
     */
    // async sendurgentJobNotification(
    //     platform: Platform,
    //     content: string,
    //     data: Record<string, unknown> = null,
    //     userIds: string[] | null = null,
    //     exchange: string = Exchanges.NOTIFICATION,
    //     routingKey: string = RoutingKeys.NOTIFICATION_SEND
    // ): Promise<void> {

    //     noti.exchangeName = exchange
    //     noti.routingKey = routingKey
    //     noti.messageVersion = "v1.0"
    //     noti.issuer = "main_api"
    //     noti.issueAt = currentTimestamp()

        
    // }

    // async sendNotification(
    //     exchange: string = Exchanges.NOTIFICATION,
    //     routingKey: string = RoutingKeys.NOTIFICATION_SEND
    // ): Promise<void> {
    //     const noti = new MessageNotificationDto()

    //     noti.exchangeName = exchange
    //     noti.routingKey = routingKey
    //     noti.messageVersion = "v1.0"
    //     noti.issuer = "main_api"
    //     noti.issueAt = currentTimestamp()
    //     noti.message = message;

    //     void await this.amqpConnection.publish(exchange, routingKey, noti)
    // }

    /**
     * @param  {Record<string, unknown>} messageContent
     * @param  {string} ex1change
     * @param  {string} routingKey
     * @param  {Record<string, string>} Optional options
     * @returns Promise
     */
    async sendMessage(
        messageContent: any,
        exchange: string,
        routingKey: string,
        options: Record<string, string> = {}
    ): Promise<void> {
        const message = new MessageRabbitDto()

        message.exchangeName = exchange
        message.routingKey = routingKey
        message.messageVersion = options["messageVersion"] ?? "v1.0"
        message.issuer = options["issuer"] ?? "main_x"
        message.issueAt = options["issueAt"] ? parseInt(options["issueAt"]) : currentTimestamp()
        message.message = messageContent

        return this.amqpConnection.publish(exchange, routingKey, message)
    }
}

