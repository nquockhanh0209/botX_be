import { IsNumber, IsOptional, IsString, Min } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateWithdrawnDto {
  @IsNumber()
  @Min(0)
  @ApiProperty({
    default: 10000,
    required: false,
  })
  balanceAffiWithdrawn: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    default: 'Content withdrawn',
    required: true,
  })
  content: string;
}
