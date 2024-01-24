import { Global, Injectable } from "@nestjs/common";
import { ItemDto, PaginatedDto } from "./api-response.dto";

@Global()
@Injectable()
export class ApiResponseService<T> {
  item(entity: T): ItemDto<T> {
    return {
      data: entity,
    };
  }

  paginate(
    items: T[],
    total: number,
    totalPages: number,
    perPage: number,
    currentPage: number,
  ): PaginatedDto<T> {
    return {
      meta: {
        total,
        totalPages,
        perPage,
        currentPage,
      },
      data: items,
    };
  }
}
