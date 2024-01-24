import { Type } from "class-transformer";
import {
    IsInt,
    IsOptional,
    IsString,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto<T> {
    data: T[]
    meta: {
        pagination: {
            currentPage: number

            limit: number
            total: number
            totalPages: number
        }
    }
}
export type PaginationOption = {
    code: string
    page: number
    limit: number
    fields: string
}

export class iPaginationOption {
    @ApiProperty({
        default: 1,
        required: false,
        description: "Page number"
    })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    page: number

    @ApiProperty({
        default: 10,
        required: false,
        description: "Limit result number"
    })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @IsOptional()
    limit: number

    @ApiProperty({
        default: "",
        required: false,
        description: "List of fields result seperate by ,"
    })
    @IsString()
    @IsOptional()
    fields: string
}

export class iPaginationOptionNoneFields {
    @ApiProperty({
        default: 1,
        required: false,
        description: "Page number"
    })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    page: number

    @ApiProperty({
        default: 10,
        required: false,
        description: "Limit result number"
    })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @IsOptional()
    limit: number
}