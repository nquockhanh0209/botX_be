import {
  IsNumber, IsOptional, IsString, Min,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class AddToCartDto {
  @IsNumber()
  @ApiProperty({
    default: 1,
    required: true,
  })
  serviceId: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @ApiProperty({
    default: 1,
    required: false,
  })
  quantity: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    default: "https://x.xom/link-profile",
    required: false,
  })
  link: string;
}
