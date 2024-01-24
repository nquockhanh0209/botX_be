import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/base/base.service";
import { Noti } from "src/entities/Noti";
import { User } from "src/entities/User";
import { CreateNotiInterface } from "src/interfaces/noti.interface";
import { Repository } from "typeorm";
import { GlobalSocket } from "./variable-noti";
import { QueryDto } from "src/dtos/query.dto";
import { paginate } from "nestjs-typeorm-paginate";

@Injectable()
export class NotiService extends BaseService<Noti> {
  constructor(
    @InjectRepository(Noti)
    private notiRepository: Repository<Noti>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(notiRepository);
  }

  /**
   *
   * @param userId
   * @returns
   */
  async getCountNofiNotSeen(userId: number) {
    const queryBuilder = this.repository
      .createQueryBuilder()
      .select("COUNT(id) as numberNotiNotSeen")
      .where(`"userId" = :userId AND "isSeen" = :isSeen`, {
        userId,
        isSeen: false,
      });

    return queryBuilder.getRawOne();
  }

  /**
   *
   * @param noti
   * @returns
   */
  async saveNewNoti(noti: CreateNotiInterface) {
    const user: User = await this.userRepository.findOne({
      where: { id: noti.userId },
    });

    const newNoti = await this.repository.save({
      ...noti,
      user,
    });
    if (GlobalSocket[newNoti.userId]) {
      GlobalSocket[newNoti.userId].emit("newNoti", JSON.stringify(newNoti));
    }
    return newNoti;
  }

  /**
   *
   * @param query
   * @param userId
   * @returns
   */
  async findPaginateNoti(query: QueryDto, userId: number) {
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
   * @param userId 
   */
  async updateAllIsSeenNoti(userId: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ isSeen: true })
      .where('"userId" = :userId', { userId })
      .execute();
  }
}
