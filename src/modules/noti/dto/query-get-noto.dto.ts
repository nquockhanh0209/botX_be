import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/dtos/query.dto";

export class QueryNotiDto extends QueryDto {
  @ApiProperty({
    default: false,
    required: false,
  })
  @IsOptional()
  @IsString()
  updateSeen?: string;
}
