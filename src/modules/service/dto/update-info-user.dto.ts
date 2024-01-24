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

export class CreateServiceDto {
  @IsString()
  @ApiProperty({
    default: "Title Service",
    required: true,
  })
  title: string; 

  @IsString()
  @IsOptional()
  @ApiProperty({
    default: "description",
    required: false,
  })
  desc: string;

  @IsNumber()
  @Min(1)
  @ApiProperty({
    default: 100,
    required: true,
  })
  minQuantity: number;

  @IsNumber()
  @IsGreaterThan("minQuantity")
  @ApiProperty({
    default: 200,
    required: true,
  })
  maxQuantity: number;

  @IsNumber()
  @ApiProperty({
    default: 200,
    required: true,
  })
  price: number;

  @IsString()
  @MaxLength(64)
  @ApiProperty({
    description: "typeService",
    default: "like",
    required:true
  })
  typeService: string;

  @IsBoolean()
  @ApiProperty({
    description: " is hot",
    default: false,
    required:true
  })
  isHot: boolean;

  @IsBoolean()
  @ApiProperty({
    description: " is guarantee",
    default: false,
    required:true
  })
  guarantee: boolean;

  @IsNumber()
  @ApiProperty({
    default: 1,
    required: true,
  })
  categoryId: number;

}
