import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MessagingService {
    // @RabbitSubscribe({
    //     exchange: ,
    //     routingKey: "subscribe-route1",
    //     queue: "subscribe-queue",
    // })
    // async competingPubSubHandler(msg: Record<string, unknown>): Promise<void> {
    //     console.log(`Received message1: ${JSON.stringify(msg)}`)
    // }

    // @RabbitSubscribe({
    //     exchange: "exchange3",
    //     routingKey: "subscribe-route2",
    //     queue: "subscribe-queue",
    // })
    // async messagePerInstanceHandler(msg: Record<string, unknown>): Promise<void> {
    //     console.log(`Received message2: ${JSON.stringify(msg)}`)
    // }
}

