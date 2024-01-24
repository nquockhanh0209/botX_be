import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { Property } from "src/utils/general.util";

export class TokenGoogleOAuthDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        default: "ya29.a0AWY7CknWtT_q7ydJeOe0tiuCgDaOgW_2T7LL2__iUz6-a-_UDzZRoqAkh38Z9D8gkXPGa_e7UAP5897qwVqwqFZIy5hInbG971-nPDY0NDmCZR41RQlL29cw01gs6qDmA5Oi0mhvdFCa2zTnEvHjMjlt91IDOQaCgYKAW0SARISFQG1tDrppCrjKLUTiR2dUPilo4JQwg0165",
    })
    tokenIdOAuth: string

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
