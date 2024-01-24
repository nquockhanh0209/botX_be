import {
    IsObject,
    IsOptional,
    IsString,
} from "class-validator";
import { BaseDto } from "src/base/base.dto";
import { Property } from "src/utils/general.util";

import { ApiProperty } from "@nestjs/swagger";

class Obj { }

export class MessageRabbitDto extends BaseDto<Obj> {
    @ApiProperty({
        description: "Exchange name"
    })
    @IsOptional()
    @IsString()
    @Property()
    exchangeName: string

    @ApiProperty({
        default: "v1.0",
        description: "Message version"
    })
    @IsOptional()
    @IsString()
    @Property()
    messageVersion: string

    @ApiProperty({
        default: "main_api",
        description: "Service send event to rabitmq"
    })
    @IsOptional()
    @IsString()
    @Property()
    issuer: string

    @ApiProperty({
        default: 1603765386,
        description: "Time to send event"
    })
    @IsOptional()
    @IsString()
    @Property()
    issueAt: number

    @ApiProperty({
        default: "send",
        description: "Action with notification"
    })
    @IsOptional()
    @IsString()
    @Property()
    routingKey: string

    @ApiProperty({
        default: {},
        description: "{}"
    })
    @IsObject()
    @Property()
    message: Record<string, unknown>
}