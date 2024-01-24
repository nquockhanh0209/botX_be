import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/base/base.service";
import { Affiliate } from "src/entities/Affiliate";
import { Repository } from "typeorm";

@Injectable()
export class AffiliateService extends BaseService<Affiliate> {
  constructor(
    @InjectRepository(Affiliate)
    private affiliateRepository: Repository<Affiliate>,
  ) {
    super(affiliateRepository);
  }

  /**
   *
   * @param userId
   * @returns
   */
  async getStatictisByUserId(userId: number) {
    const queryBuilder = this.repository
      .createQueryBuilder()
      .select("COUNT(id)", "numberRef")
      .addSelect('SUM("priceService")', "amount")
      .addSelect('SUM("balanceAffi")', "totalCommission")
      .addSelect(`Count(DISTINCT "fromId")`, "numberMember")
      .where('"toId" = :userId', { userId })
      .groupBy('"toId"');

    return queryBuilder.getRawOne();
  }
}
