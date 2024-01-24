import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Sort } from "src/enums/sort.enum";
import { IsBiggerThanDate } from "src/validators/ibigger-than-date.validator";

export class QueryDto {
  @ApiProperty({
    default: 1,
    required: false,
  })
  @IsOptional()
  page: number;

  @ApiProperty({
    default: 10,
    required: false,
  })
  @IsOptional()
  limit: number;

  @ApiProperty({
    example: "createdAt",
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    example: "DESC",
    required: false,
  })
  @IsOptional()
  @IsEnum(Sort)
  sortType?: Sort;

  @ApiProperty({
    example: "Search keyword: ",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @IsDate({ strict: true } as any)
  @Transform(({ value }) => value && new Date(value))
  @ApiProperty({
    description: "Time start",
    default: "2023-10-09 00:00:00",
    required: false,
  })
  @IsOptional()
  startDate: Date;

  @IsDate({ strict: true } as any)
  @Transform(({ value }) => value && new Date(value))
  @IsBiggerThanDate("startDate", {
    message: "endDate must be larger than startDate",
  })
  @ApiProperty({
    description: "Time end",
    default: "2023-10-19 23:59:59",
    required: false,
  })
  @IsOptional()
  endDate: Date;
}
