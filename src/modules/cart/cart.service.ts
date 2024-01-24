import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationMeta,
  Pagination,
  paginate,
  paginateRaw,
  paginateRawAndEntities,
} from "nestjs-typeorm-paginate";
import { BaseService } from "src/base/base.service";
import { QueryDto } from "src/dtos/query.dto";
import { Cart } from "src/entities/Cart";
import { Repository } from "typeorm";

@Injectable()
export class CartService extends BaseService<Cart> {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {
    super(cartRepository);
  }

  /**
   *
   * @param query
   * @param userId
   * @returns
   */
  async findPaginateAllCarts(query: QueryDto, userId: number) {
    const page = query.page || 0;
    const limit = query.limit || 10;

    const queryBuilder = this.repository.createQueryBuilder("cart");
    queryBuilder
      .leftJoinAndSelect("cart.service", "service")
      .where(`"userId" = :userId`, { userId })
      .orderBy(`cart.updatedAt`, "DESC");

    return paginateRawAndEntities(queryBuilder, {
      page,
      limit,
    });
  }

  /**
   *
   * @param serviceId
   * @param userId
   */
  async removeCartByServiceIdAndUserId(
    serviceId: number,
    userId: number,
    link: string,
  ) {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where(
        `"userId" = :userId AND "serviceId" = :serviceId AND link = :link`,
        {
          userId,
          serviceId,
          link,
        },
      )
      .execute();
  }
}
