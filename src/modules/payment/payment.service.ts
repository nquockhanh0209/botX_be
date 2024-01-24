import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate, paginateRawAndEntities } from "nestjs-typeorm-paginate";
import { BaseService } from "src/base/base.service";
import { QueryDto } from "src/dtos/query.dto";
import { Payment } from "src/entities/Payment";
import { Repository } from "typeorm";
import { FilterTransactionDto } from "./dto/filter-transaction.dto";

@Injectable()
export class PaymentService extends BaseService<Payment> {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    super(paymentRepository);
  }

  /**
   *
   * @param paymentId
   * @returns
   */
  async findTransactionLeftJoinUser(paymentId: number) {
    return this.repository.findOne({
      relations: ["user"],
      where: {
        id: paymentId,
      },
    });
  }

  /**
   *
   * @param query
   * @param userId
   * @returns
   */
  async findPaginateMyTransaction(query: QueryDto, userId: number) {
    const page = query.page || 0;
    const limit = query.limit || 10;
    const sortBy = query.sortBy || "createdAt";
    const sortType = query.sortType || "DESC";
    const search = query.search || "";

    const queryBuilder = this.repository
      .createQueryBuilder()
      .where(`"userId" = :userId`, { userId });

    if (search) {
      queryBuilder.andWhere("upper(content) like :search", {
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
   * @param query 
   * @returns 
   */
  async findPaginateAllTransaction(query: FilterTransactionDto) {
    const page = query.page || 0;
    const limit = query.limit || 10;
    const sortBy = query.sortBy || "createdAt";
    const sortType = query.sortType || "DESC";
    const search = query.search || "";
    const statusFilter = query.status || "";
    const startDate = query.startDate;
    const endDate = query.endDate;

    const queryBuilder = this.repository
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.user", "user")
      .where(`1 = 1`);

    if (search) {
      queryBuilder.andWhere("upper(payment.content) like :search", {
        search: `%${search.toUpperCase()}%`,
      });
    }

    if (statusFilter) {
      queryBuilder.andWhere(`payment.statusPayment = :statusFilter`, {
        statusFilter,
      });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        `payment.createdAt >= :startDate AND payment.createdAt <= :endDate`,
        {
          startDate,
          endDate,
        },
      );
    }
    queryBuilder.orderBy(`payment.${sortBy}`, sortType);

    return paginateRawAndEntities(queryBuilder, {
      page,
      limit,
    });
  }
}
