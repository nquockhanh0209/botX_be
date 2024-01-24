import { Controller, Get, SetMetadata } from "@nestjs/common";
import { BaseController } from "src/base/base.controller";
import { MessageComponent } from "src/components/message.component";
import { AffiliateService } from "./affiliate.service";
import { Token } from "src/decorators/token.decorator";
import { TokenDto } from "src/dtos/token.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserService } from "../user/user.service";
import { User } from "src/entities/User";
import { ConfigService } from "@nestjs/config";

@Controller("affiliate")
@ApiTags("Affiliate")
@ApiBearerAuth()
export class AffiliateController extends BaseController {
  constructor(
    private i18n: MessageComponent,
    private readonly affiliateService: AffiliateService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super(i18n);
  }

  /**
   *
   * @param token
   * @returns
   */
  @Get("/statictis")
  @SetMetadata("roles", ["user"])
  async getStatictisUser(@Token() token: TokenDto) {
    try {
      const reulst = await this.affiliateService.getStatictisByUserId(
        token.userId,
      );
      const data = {
        numberRef: reulst?.numberRef ? reulst.numberRef : null,
        amount: reulst?.amount ? reulst.amount : null,
        totalCommission: reulst?.totalCommission
          ? reulst.totalCommission
          : null,
        numberMember: reulst?.numberMember ? reulst.numberMember : null,
      };
      const user: User = await this.userService.findById(token.userId);
      return {
        ...data,
        balanceAffi: user.balanceAffi,
        rate: this.configService.get<number>("rateAffiliate"),
        refId: user.refId,
      };
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }
}
