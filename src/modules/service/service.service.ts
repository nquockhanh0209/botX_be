import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/base/base.service";
import { QueryDto } from "src/dtos/query.dto";
import { Service } from "src/entities/Service";
import { In, Repository } from "typeorm";
import {
  paginate,
  IPaginationOptions,
  Pagination,
  IPaginationMeta,
} from "nestjs-typeorm-paginate";
@Injectable()
export class ServiceService extends BaseService<Service> {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {
    super(serviceRepository);
  }

  /**
   *
   * @returns
   */
  async findListTrendingService(): Promise<Service[]> {
    return this.serviceRepository.find({
      where: {
        isHot: true,
      },
    });
  }

  async findPaginateServices(
    query: QueryDto,
    categoryId?: number,
  ): Promise<Pagination<Service, IPaginationMeta>> {
    const page = query.page || 0;
    const limit = query.limit || 10;
    const sortBy = query.sortBy || "createdAt";
    const sortType = query.sortType || "DESC";
    const search = query.search || "";

    const queryBuilder = this.repository.createQueryBuilder();
    queryBuilder.where("1 = 1");
    if (categoryId) {
      queryBuilder.andWhere('"categoryId" = :categoryId', {
        categoryId: categoryId,
      });
    }
    if (search) {
      queryBuilder.andWhere("title like :search", {
        search: `%${search}%`,
      });
    }
    queryBuilder.orderBy(`"${sortBy}"`, sortType);

    return paginate(queryBuilder, {
      page,
      limit,
    });
  }

  /**
   *
   * @param ids
   * @returns
   */
  async findServiceByIds(ids: any) {
    return this.serviceRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
