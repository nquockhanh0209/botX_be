import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { Property } from "src/utils/general.util";
import { IsGreaterThan } from "src/validators/compare-field";

export class CreateOrderHistoryDto {
  @IsNumber()
  @ApiProperty({
    default: 1,
    required: true,
  })
  serviceId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    default: 1,
    required: true,
  })
  cartId: number;

  @IsString()
  @ApiProperty({
    default: "https://x.com/link-profile",
    required: false,
  })
  link: string;

  @IsNumber()
  @Min(1)
  @ApiProperty({
    default: 100,
    required: true,
  })
  amount: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    default: "refId",
    required: false,
  })
  uplineId: string;
}
