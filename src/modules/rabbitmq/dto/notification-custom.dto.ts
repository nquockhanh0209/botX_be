import {
    IsArray,
    IsEmpty,
    IsInt,
    IsObject,
    IsString,
} from "class-validator";
import { Property } from "src/utils/general.util";

import { MessageData } from "./message-data.dto";

/**
 * USING :
 * + Inject Queue sendNotification : @InjectQueue("sendNotification") private sendNotificationQueue: Queue,
 *      const message_obj = new MessageData({
            message: "Tại sao lại thế?",
            title: this.i18n.lang("SUCCESS"),
            subtile: this.i18n.lang("SUCCESS"),
            deepLink: ""
        });

        const notificationCustom = new NotificationCustomDto(["1"], message_obj)

        this.sendNotificationQueue.add(notificationCustom).then(data => {
        }).catch(error => console.error("Add to queue error", error))
 */

export class NotificationCustomDto {

    @IsEmpty()
    @IsArray()
    @Property()
    userIds: string[]

    @IsObject()
    @Property()
    message: MessageData

    @Property()
    @IsString()
    type: string

    @Property()
    @IsInt()
    delayTime: number

    @Property()
    @IsInt()
    pointTime: number

    constructor(userIds: string[], message: MessageData, type: string, delayTime: number, pointTime: number) {
        this.userIds = userIds
        this.message = message
        this.type = type
        this.delayTime = delayTime
        this.pointTime = pointTime
    }
}