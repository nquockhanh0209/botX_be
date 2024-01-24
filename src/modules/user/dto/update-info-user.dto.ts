import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { Property } from "src/utils/general.util";
import { IsPhoneNumber } from "src/validators/validate-phone-number";

export class UpdateInfoUserDto {
  @IsString()
  @IsOptional()
  @IsPhoneNumber({
    message: "Phone number is not in correct format",
  })
  @ApiProperty({
    default: "0x6777888",
    required: false,
  })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    default: "abc@domain.com",
    required: false,
  })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    default: "abc",
    required: false,
  })
  username: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    default: "TP bank",
    required: false,
  })
  bankName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    default: "Hello",
    required: false,
  })
  accountName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    default: "09662221111xxxx",
    required: false,
  })
  accountNumber: string;

  @IsOptional()
  @Property()
  @IsString()
  //Chứa ít nhất 7 ký tự có số và chữ
  // @Matches(/^.*(?=.{7})(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9!@#$%]+$/)
  @ApiProperty({
    description: "Password",
    default: "ExamplePasswrod",
  })
  currentPassword: string;

  @IsOptional()
  @Property()
  @IsString()
  //Chứa ít nhất 7 ký tự có số và chữ
  // @Matches(/^.*(?=.{7})(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9!@#$%]+$/)
  @ApiProperty({
    description: "Password",
    default: "New ExamplePasswrod",
  })
  newPassword: string;


  @IsOptional()
  @Property()
  @IsString()
  @ApiProperty({
    description: "avatar user",
    default: "http://link-avatar",
  })
  avatarUrl: string;
}
