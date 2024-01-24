import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  SetMetadata,
} from "@nestjs/common";
import { BaseController } from "src/base/base.controller";
import { MessageComponent } from "src/components/message.component";
import { ServiceService } from "./service.service";
import RedisComponent from "src/components/redis.component";
import { TokenDto } from "src/dtos/token.dto";
import { Token } from "src/decorators/token.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateServiceDto } from "./dto/update-info-user.dto";
import { Service } from "src/entities/Service";
import { KeyRedis } from "src/constants/key-redis.const";
import { ParseIntPipe1 } from "src/validators/parse-int.pipe";
import { throwValidate } from "src/utils/throw-exception.util";
import { ErrorCodes } from "src/constants/error-code.const";
import { plainToClass } from "class-transformer";
import { QueryDto } from "src/dtos/query.dto";
import { IPaginationMeta, Pagination } from "nestjs-typeorm-paginate";
import { UserFavouriteService } from "../user-favourite/user-favourite.service";
import { IsNull } from "typeorm";
import { CategoryService } from "../category/category.service";

@ApiTags("Service")
@Controller("service")
export class ServiceController extends BaseController {
  constructor(
    private i18n: MessageComponent,
    private readonly redis: RedisComponent,
    private readonly serviceService: ServiceService,
    private readonly userFavouriteService: UserFavouriteService,
    private readonly categoryService: CategoryService,
  ) {
    super(i18n);
  }

  /**
   *
   * @param token
   * @param createService
   * @returns
   */
  //   @ApiBearerAuth()
  @Post("create")
  @SetMetadata("roles", ["admin"])
  async createService(
    @Token() token: TokenDto,
    @Body() createService: CreateServiceDto,
  ) {
    try {
      const checkCategory = await this.categoryService.findById(
        createService.categoryId,
      );
      if (!checkCategory) {
        throwValidate(
          this.i18n.lang("CATEGORY_NOT_EXITS"),
          "Thể loại không tồn tại",
          ErrorCodes.CATEGORY_NOT_EXITS,
        );
      }

      const dataSave = plainToClass(Service, {
        ...createService,
        category: checkCategory,
      });
      const service: Service = await this.serviceService.save(dataSave);
      await this.redis.hSet(
        KeyRedis.LIST_SERVICES,
        service.id,
        JSON.stringify(service),
      );
      return service;
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  /**
   *
   * @param token
   * @param updateService
   * @param id
   * @returns
   */
  //   @ApiBearerAuth()
  @Put(":id")
  @SetMetadata("role", ["admin"])
  async updateService(
    @Token() token: TokenDto,
    @Body() updateService: CreateServiceDto,
    @Param("id", ParseIntPipe1) id: number,
  ): Promise<Service> {
    try {
      const checkCategory = await this.categoryService.findById(
        updateService.categoryId,
      );
      if (!checkCategory) {
        throwValidate(
          this.i18n.lang("CATEGORY_NOT_EXITS"),
          "Thể loại không tồn tại",
          ErrorCodes.CATEGORY_NOT_EXITS,
        );
      }
      const checkServiceExits = await this.serviceService.findById(id);
      if (!checkServiceExits) {
        throwValidate(
          this.i18n.lang("SERVICE_NOT_FOUND"),
          "Không tìm thấy service",
          ErrorCodes.SERVICE_NOT_FOUND,
        );
      }
      const { categoryId, ...dataUpdateService } = updateService;

      const dataUpdate: Service = plainToClass(Service, {
        ...dataUpdateService,
        category: checkCategory,
      });
      const newInfoService: Service = await this.serviceService.update(
        id,
        dataUpdate,
      );

      // update data in redis
      await this.redis.hSet(
        KeyRedis.LIST_SERVICES,
        newInfoService.id,
        JSON.stringify(newInfoService),
      );

      return newInfoService;
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  /**
   *
   * @param token
   * @param id
   * @returns
   */
  //   @ApiBearerAuth()
  @Delete(":id")
  @SetMetadata("role", ["admin"])
  async deleteService(
    @Token() token: TokenDto,
    @Param("id", ParseIntPipe1) id: number,
  ) {
    try {
      const checkServiceExits = await this.serviceService.findById(id);
      if (!checkServiceExits) {
        throwValidate(
          this.i18n.lang("SERVICE_NOT_FOUND"),
          "Không tìm thấy service",
          ErrorCodes.SERVICE_NOT_FOUND,
        );
      }
      await this.redis.hDel(KeyRedis.LIST_SERVICES, id);
      await this.serviceService.delete(id);
      return {
        message: "Delete service success",
      };
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  /**
   *
   * @param token
   * @returns
   */
  //   @ApiBearerAuth()
  @Get("/trigger-redis")
  @SetMetadata("roles", ["admin"])
  async triggerRedis(@Token() token: TokenDto) {
    try {
      const listServices: Service[] = await this.serviceService.findAll();
      await Promise.all(
        listServices.map(async (service) => {
          await this.redis.hSet(
            KeyRedis.LIST_SERVICES,
            service.id,
            JSON.stringify(service),
          );
        }),
      );
      return {
        message: "Trigger list service into redis success",
      };
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  /**
   *
   * @returns
   */
  @Get("list-trending")
  async getListServiceTrending(@Token() token: TokenDto) {
    try {
      const listServiceTredings: Service[] =
        await this.serviceService.findListTrendingService();
      const listCheckFavourite = await this.checkUserFavourite(
        listServiceTredings,
        token.userId,
      );

      return listCheckFavourite;
    } catch (error) {
      this.throwErrorProcessNoAuth(error);
    }
  }

  /**
   *
   * @param query
   * @returns
   */
  @Get("all-service")
  async getAllService(@Query() query: QueryDto, @Token() token: TokenDto) {
    try {
      if (!query.limit && !query.sortBy && !query.search) {
        const listDataInRedis: Record<string, string> =
          await this.redis.hGetAll(KeyRedis.LIST_SERVICES);
        let listServices: Service[] = [];
        if (Object.keys(listDataInRedis).length) {
          listServices = Object.keys(listDataInRedis).map((item) =>
            plainToClass(Service, JSON.parse(listDataInRedis[item])),
          );
        }

        // check favourite of user
        const listCheckFavourite = await this.checkUserFavourite(
          listServices,
          token.userId,
        );
        return {
          items: listCheckFavourite,
          meta: {
            totalItems: listServices.length,
            itemCount: listServices.length,
            itemsPerPage: listServices.length,
            totalPages: 1,
            currentPage: 1,
          },
        };
      }
      const data: Pagination<Service, IPaginationMeta> =
        await this.serviceService.findPaginateServices(query);

      // check favourite of user
      const listCheckFavourite = await this.checkUserFavourite(
        data.items,
        token.userId,
      );
      return { ...data, items: listCheckFavourite };
    } catch (error) {
      this.throwErrorProcessNoAuth(error);
    }
  }

  @Get("category/:categoryId")
  async getAllServiceByCategoryId(
    @Query() query: QueryDto,
    @Token() token: TokenDto,
    @Param("categoryId", ParseIntPipe1) categoryId: number,
  ) {
    try {
      const data: Pagination<Service, IPaginationMeta> =
        await this.serviceService.findPaginateServices(query, categoryId);

      // check favourite of user
      const listCheckFavourite = await this.checkUserFavourite(
        data.items,
        token.userId,
      );
      return { ...data, items: listCheckFavourite };
    } catch (error) {
      this.throwErrorProcessNoAuth(error);
    }
  }

  /**
   * Check if the service list is in favorites
   * @param listDatas
   * @param userId
   * @returns
   */
  protected async checkUserFavourite(listDatas: Service[], userId?: number) {
    const listCheckFavourite = [];
    for (let item of listDatas) {
      const checkUserFavourite = await this.userFavouriteService.findOne({
        where: {
          "user.id": userId || IsNull(),
          "service.id": item.id,
        },
      });
      let dataCheckUserFavourite = null;
      if (!checkUserFavourite) {
        dataCheckUserFavourite = { ...item, favourite: false };
      } else {
        dataCheckUserFavourite = { ...item, favourite: true };
      }

      listCheckFavourite.push(dataCheckUserFavourite);
    }

    return listCheckFavourite;
  }
}
