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

export class AddFavoriteDto {
  @IsNumber()
  @ApiProperty({
    default: 1,
    required: true,
  })
  serviceId: number;
}
