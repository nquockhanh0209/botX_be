import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { Property } from "src/utils/general.util";

export class LoginAdminDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        default: "admin@x-app.com",
    })
    email: string;

    @Length(8, 24)
    @Property()
    @IsString()
    //Chứa ít nhất 7 ký tự có số và chữ
    // @Matches(/^.*(?=.{7})(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9!@#$%]+$/)
    @ApiProperty({
        description: "Password",
        default: "ExamplePasswrod",
    })
    password: string;

    
}
