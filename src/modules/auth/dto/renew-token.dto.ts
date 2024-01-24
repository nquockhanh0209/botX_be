import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { Property } from "src/utils/general.util";

export class RenewTokenDto {

    @IsNotEmpty()
    @ApiProperty({
        default: "15de8dda-b9de-11eb-8529-0242ac130003",
    })
    refreshToken: string

    @IsNotEmpty()
    @ApiProperty({
        default: "1",
    })
    userId: number

    @ApiProperty({
        description: "User Agent",
        default:"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
    })
    @IsOptional()
    @Property()
    @IsString()
    userAgent:string

    @ApiProperty({
        description: "Ip",
        default:"192.168.1.1"
    })
    @IsOptional()
    @Property()
    @IsString()
    ip:string
}
