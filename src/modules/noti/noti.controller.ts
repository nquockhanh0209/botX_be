import { Controller, Get, Query, SetMetadata } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/base/base.controller";
import { NotiService } from "./noti.service";
import { MessageComponent } from "src/components/message.component";
import { Token } from "src/decorators/token.decorator";
import { TokenDto } from "src/dtos/token.dto";
import { QueryDto } from "src/dtos/query.dto";
import { QueryNotiDto } from "./dto/query-get-noto.dto";

@Controller("noti")
@ApiTags("Noti")
@ApiBearerAuth()
export class NotiController extends BaseController {
  constructor(
    private readonly notiService: NotiService,
    private i18n: MessageComponent,
  ) {
    super(i18n);
  }

  /**
   *
   * @param token
   * @param query
   * @returns
   */
  @Get("all-noti")
  @SetMetadata("roles", ["user"])
  async getAllNoti(@Token() token: TokenDto, @Query() query: QueryNotiDto) {
    try {
      if (query.updateSeen == 'true') {
        await this.notiService.updateAllIsSeenNoti(token.userId);
      }

      const numberNotiNotSeen = await this.notiService.getCountNofiNotSeen(
        token.userId,
      );

      const listNotis = await this.notiService.findPaginateNoti(
        query,
        token.userId,
      );
      return {
        ...listNotis,
        numberNotiNotSeen: numberNotiNotSeen["numbernotinotseen"]
          ? numberNotiNotSeen["numbernotinotseen"]
          : 0,
      };
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }
}
