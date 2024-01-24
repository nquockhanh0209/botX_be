import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginateRawAndEntities } from "nestjs-typeorm-paginate";
import { BaseService } from "src/base/base.service";
import { QueryDto } from "src/dtos/query.dto";
import { UserFavourite } from "src/entities/UserFavourite";
import { Repository } from "typeorm";

@Injectable()
export class UserFavouriteService extends BaseService<UserFavourite> {
  constructor(
    @InjectRepository(UserFavourite)
    private serviceRepository: Repository<UserFavourite>,
  ) {
    super(serviceRepository);
  }

  /**
   *
   * @param userId
   * @param query
   */
  async getListMyFavourite(userId: number, query: QueryDto) {
    const page = query.page || 0;
    const limit = query.limit || 10;
    const sortBy = query.sortBy || "createdAt";
    const sortType = query.sortType || "DESC";
    const search = query.search || "";

    const queryBuilder = this.repository
      .createQueryBuilder("favourite")
      .leftJoinAndSelect("favourite.service", "service")
      .where("favourite.userId = :userId", { userId });

    if (search) {
      queryBuilder.where("service.title like :search", {
        search: `%${search}%`,
      });
    }
    queryBuilder.orderBy(`service.${sortBy}`, sortType);

    return paginateRawAndEntities(queryBuilder, {
      page,
      limit,
    });
  }
}
