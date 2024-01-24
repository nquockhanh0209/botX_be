import {
  IsOptional,
  IsString,
} from "class-validator";
import { Property } from "src/utils/general.util";

import { ApiProperty } from "@nestjs/swagger";

import { BaseDto } from "../base/base.dto";

class Obj { }

export class Fields extends BaseDto<Obj> {
    @ApiProperty({
        required: false,
        description: "fields"
    })
    @IsOptional()
    @IsString()
    @Property()
    fields: string;
}
