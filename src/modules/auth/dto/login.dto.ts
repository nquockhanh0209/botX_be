import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Matches,
  } from "class-validator";
  
  import { ApiProperty } from "@nestjs/swagger";
  import { Property } from "src/utils/general.util";
  import { IsPhoneNumber } from "src/validators/validate-phone-number";
  
  export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber({
      message: "Phone number is not in correct format",
    })
    @ApiProperty({
      default: "0x6777888",
    })
    phoneNumber: string;
  
  
    // @Length(8, 24)
    @Property()
    @IsString()
    //Chứa ít nhất 7 ký tự có số và chữ
    // @Matches(/^.*(?=.{7})(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9!@#$%]+$/)
    @ApiProperty({
      description: "Password",
      default: "ExamplePasswrod",
    })
    password: string;
  
    @ApiProperty({
      description: "User Agent",
      default:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    })
    @IsOptional()
    @Property()
    @IsString()
    userAgent: string;
  
    @ApiProperty({
      description: "Ip",
      default: "192.168.1.1",
    })
    @IsOptional()
    @Property()
    @IsString()
    ip: string;
  }
  