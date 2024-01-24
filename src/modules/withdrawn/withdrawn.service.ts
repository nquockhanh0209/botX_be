import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate, paginateRawAndEntities } from "nestjs-typeorm-paginate";
import { BaseService } from "src/base/base.service";
import { QueryDto } from "src/dtos/query.dto";
import { Withdrawn } from "src/entities/Withdrawn";
import { Repository } from "typeorm";
import { FilterWithdrawDto } from "./dto/filter-withdraw.dto";

@Injectable()
export class WithdrawnService extends BaseService<Withdrawn> {
  constructor(
    @InjectRepository(Withdrawn)
    private withdrawnRepository: Repository<Withdrawn>,
  ) {
    super(withdrawnRepository);
  }

  /**
   *
   * @param withdrawn
   * @returns
   */
  async findWithdrawnLeftJoinUser(withdrawn: number) {
    return this.repository.findOne({
      relations: ["user"],
      where: {
        id: withdrawn,
      },
    });
  }

  /**
   *
   * @param query
   * @param userId
   * @returns
   */
  async findPaginateMyWithdrawns(query: QueryDto, userId: number) {
    const page = query.page || 0;
    const limit = query.limit || 10;
    const sortBy = query.sortBy || "createdAt";
    const sortType = query.sortType || "DESC";

    const queryBuilder = this.repository
      .createQueryBuilder()
      .where(`"userId" = :userId`, { userId });

    queryBuilder.orderBy(`"${sortBy}"`, sortType);

    return paginate(queryBuilder, {
      page,
      limit,
    });
  }


    /**
   * 
   * @param query 
   * @returns 
   */
    async findPaginateAllTransaction(query: FilterWithdrawDto) {
        const page = query.page || 0;
        const limit = query.limit || 10;
        const sortBy = query.sortBy || "createdAt";
        const sortType = query.sortType || "DESC";
        const search = query.search || "";
        const statusFilter = query.status || "";
        const startDate = query.startDate;
        const endDate = query.endDate;
    
        const queryBuilder = this.repository
          .createQueryBuilder("withdrawn")
          .leftJoinAndSelect("withdrawn.user", "user")
          .where(`1 = 1`);
    
        if (search) {
          queryBuilder.andWhere("upper(withdrawn.accountName) like :search", {
            search: `%${search.toUpperCase()}%`,
          });
        }
    
        if (statusFilter) {
          queryBuilder.andWhere(`withdrawn.statusWithdrawn = :statusFilter`, {
            statusFilter,
          });
        }
    
        if (startDate && endDate) {
          queryBuilder.andWhere(
            `withdrawn.createdAt >= :startDate AND withdrawn.createdAt <= :endDate`,
            {
              startDate,
              endDate,
            },
          );
        }
        queryBuilder.orderBy(`withdrawn.${sortBy}`, sortType);
    
        return paginateRawAndEntities(queryBuilder, {
          page,
          limit,
        });
      }
}
