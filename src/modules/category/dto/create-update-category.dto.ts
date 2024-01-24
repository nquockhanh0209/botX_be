import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateOrUpdateCategoryDto {
  @ApiProperty({
    required: true,
    default: "Like",
    description: "Title category",
  })
  @IsString()
  title: string;
}
