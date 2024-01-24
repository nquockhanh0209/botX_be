import { Injectable } from "@nestjs/common";
import { BaseService } from "src/base/base.service";
import { UserRepository } from "./user.repository";
import { User } from "src/entities/User";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QueryDto } from "src/dtos/query.dto";
import { paginateRaw, paginateRawAndEntities } from "nestjs-typeorm-paginate";

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  /**
   *
   * @param email
   * @returns
   */
  async findUserByEmail(email: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  /**
   *
   * @param userId
   */
  async findOneUser(userId: number) {
    const querybuilder = this.repository
      .createQueryBuilder("user")
      .leftJoin("user.orderHistory", "orderHistory")
      .addSelect("COUNT(orderHistory.id)", "numberOrder")
      .addSelect("SUM(orderHistory.price)", "spent")
      .where("user.id = :userId", { userId })
      .groupBy("user.id");

    return querybuilder.getRawOne();
  }

  async findAllUser(query: QueryDto) {
    const page = query.page || 0;
    const limit = query.limit || 10;
    const sortBy = query.sortBy || "createdAt";
    const sortType = query.sortType || "DESC";
    const search = query.search || "";

    const queryBuilder = this.repository
      .createQueryBuilder("user")
      .leftJoin("user.orderHistory", "orderHistory")
      .select("user")
      .addSelect("count(orderHistory.id)", "totalOrder")
      .addSelect("sum(orderHistory.price)", "totalSpent")
      .groupBy("user.id");

    if (search) {
      queryBuilder.where("user.username like :search", {
        search: `%${search}%`,
      });
    }

    queryBuilder.orderBy(`user.${sortBy}`, sortType);

    return paginateRaw(queryBuilder, {
      page,
      limit,
    });
  }


  async findListUserNotOrder(query: QueryDto) {
    const startDate = query.startDate;
    const endDate = query.endDate;

    const queryBuilder = this.repository
      .createQueryBuilder("user")
      .leftJoin("user.orderHistory", "orderHistory")
      .select("user.email", "email")
      .addSelect("user.createdAt", "createdAt")
      .where("user.email IS NOT NULL")
      .groupBy("user.id")
      .having("COUNT(orderHistory.userId) = 0");

    if (startDate && endDate) {
      queryBuilder.where(
        "orderHistory.createdAt >= :startDate and orderHistory.createdAt <= :endDate",
        {
          startDate,
          endDate,
        },
      );
    }

    return queryBuilder.getRawMany();
  }
}
