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

export class CreateTransactionDto {
  @IsNumber()
//   @Min(1000)
  @ApiProperty({
    default: 10000,
    required: false,
  })
  amountDeposit: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    default: "vnd",
    required: false,
  })
  currency: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    default: "0xAaaaaaaavvvv",
    required: false,
  })
  txHash: string;
}
