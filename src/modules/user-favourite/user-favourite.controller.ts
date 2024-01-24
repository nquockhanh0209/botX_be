import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  SetMetadata,
} from "@nestjs/common";
import { BaseController } from "src/base/base.controller";
import { MessageComponent } from "src/components/message.component";
import { UserFavouriteService } from "./user-favourite.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Token } from "src/decorators/token.decorator";
import { TokenDto } from "src/dtos/token.dto";
import { AddFavoriteDto } from "./dto/add-favourite.dto";
import { ServiceService } from "../service/service.service";
import { Service } from "src/entities/Service";
import { throwValidate } from "src/utils/throw-exception.util";
import { ErrorCodes } from "src/constants/error-code.const";
import { UserFavourite } from "src/entities/UserFavourite";
import { User } from "src/entities/User";
import { UserService } from "../user/user.service";
import { plainToClass } from "class-transformer";
import { ParseIntPipe1 } from "src/validators/parse-int.pipe";
import { QueryDto } from "src/dtos/query.dto";

@ApiBearerAuth()
@ApiTags("User Favourite")
@Controller("user-favourite")
export class UserFavouriteController extends BaseController {
  constructor(
    private i18n: MessageComponent,
    private readonly userFavouriteService: UserFavouriteService,
    private readonly serviceService: ServiceService,
    private readonly userService: UserService,
  ) {
    super(i18n);
  }

  @Post("add-favourite")
  @SetMetadata("roles", ["user"])
  async addFavorite(
    @Body() addFavorite: AddFavoriteDto,
    @Token() token: TokenDto,
  ) {
    try {
      const checkServiceExits: Service = await this.serviceService.findById(
        addFavorite.serviceId,
      );

      const user: User = await this.userService.findById(token.userId);
      if (!checkServiceExits) {
        throwValidate(
          this.i18n.lang("SERVICE_NOT_FOUND"),
          "Không tìm thấy service",
          ErrorCodes.SERVICE_NOT_FOUND,
        );
      }

      const dataSave = plainToClass(UserFavourite, {
        user: user,
        service: checkServiceExits,
      });
      await this.userFavouriteService.save(dataSave);

      return {
        message: "Add favourite success",
      };
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  /**
   *
   * @param token
   * @param serviceId
   * @returns
   */
  @Delete("remove/:serviceId")
  @SetMetadata("roles", ["user"])
  async deleteFavourite(
    @Token() token: TokenDto,
    @Param("serviceId", ParseIntPipe1) serviceId: number,
  ) {
    try {
      const checkUserFavourite = await this.userFavouriteService.findOne({
        where: {
          "service.id": serviceId,
          "user.id": token.userId,
        },
      });
      if (!checkUserFavourite) {
        throwValidate(
          this.i18n.lang("FAVOURITE_NOT_EXIST"),
          "This favorite does not exist",
          ErrorCodes.FAVOURITE_NOT_EXIST,
        );
      }
      await this.userFavouriteService.delete(checkUserFavourite.id);
      return {
        message: "Removed favorites list successfully",
      };
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  /**
   *
   * @param token
   * @param query
   */
  @Get("my-favourite")
  @SetMetadata("roles", ["user"])
  async listMyFavourite(@Token() token: TokenDto, @Query() query: QueryDto) {
    try {
      const reulst = await this.userFavouriteService.getListMyFavourite(
        token.userId,
        query,
      );
      const addIsFavourite = reulst[0].items.map((item) => {
        const service = item["service"];
        service["favourite"] = true;
        return { ...item, service };
      });
      return { ...reulst[0], items: addIsFavourite };
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }
}
