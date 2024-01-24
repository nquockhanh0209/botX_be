import { applyDecorators, Type } from "@nestjs/common";
import { ApiOkResponse, ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        $ref: getSchemaPath(PaginatedDto),
      },
    }),
  );
};

export class LengthAwarePaginatorMeta {
  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty()
  currentPage: number;
}

export class PaginatedItems<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
}
export class PaginatedDto<TData> {
  @ApiProperty()
  meta: LengthAwarePaginatorMeta;

  @ApiProperty()
  @IsArray()
  data: TData[];
}

export class ItemDto<TData> {
  data: TData;
}
