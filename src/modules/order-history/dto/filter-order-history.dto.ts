import {
  IsBoolean,
  IsEnum,
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
import { QueryDto } from "src/dtos/query.dto";
import {
  StatusFilterOrderHistory,
  StatusOrderHistory,
} from "src/enums/service.enum";

export class FilterOrderHistoryDto extends QueryDto {
  @IsEnum(StatusOrderHistory)
  @IsOptional()
  @ApiProperty({
    default: StatusOrderHistory.ACTIVE,
    required: false,
    enum: StatusOrderHistory,
  })
  status: StatusOrderHistory;
}
