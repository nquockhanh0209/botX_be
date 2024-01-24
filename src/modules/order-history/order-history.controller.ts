import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  SetMetadata,
} from "@nestjs/common";
import { BaseController } from "src/base/base.controller";
import { MessageComponent } from "src/components/message.component";
import { ServiceService } from "../service/service.service";
import { OrderHistoryService } from "./order-history.service";
import { Token } from "src/decorators/token.decorator";
import { TokenDto } from "src/dtos/token.dto";
import { CreateOrderHistoryDto } from "./dto/create-order-history.dto";
import { throwValidate } from "src/utils/throw-exception.util";
import { ErrorCodes } from "src/constants/error-code.const";
import { User } from "src/entities/User";
import { UserService } from "../user/user.service";
import { plainToClass } from "class-transformer";
import { OrderHistory } from "src/entities/OrderHistory";
import { CartService } from "../cart/cart.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RabbitMQService } from "../rabbitmq/rabbitmq.service";
import { Exchanges } from "src/constants/subscribe.const";
import { FilterOrderHistoryDto } from "./dto/filter-order-history.dto";
import { Affiliate } from "src/entities/Affiliate";
import { ConfigService } from "@nestjs/config";
import { AffiliateService } from "../affiliate/affiliate.service";
import { Service } from "src/entities/Service";
import { QueryDto } from "src/dtos/query.dto";
import type { Response } from "express";
import { CsvService } from "../csv/csv.service";
import { createReadStream } from "fs";
import { join } from "path";
import { RateAffiliate } from "src/constants/filter-order-history";
import { Limit, TypeLimitService } from "src/constants/limit-link.const";

@ApiBearerAuth()
@ApiTags("Order History")
@Controller("order-history")
export class OrderHistoryController extends BaseController {
  constructor(
    private i18n: MessageComponent,
    private readonly serviceService: ServiceService,
    private readonly orderHistoryService: OrderHistoryService,
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly affiliateService: AffiliateService,

    private readonly csvService: CsvService,

    private readonly configService: ConfigService,
  ) {
    super(i18n);
  }

  /**
   *
   * @param token
   * @param createListOrderHistory
   * @returns
   */
  @Post("add-history")
  @SetMetadata("roles", ["user"])
  async checkout(
    @Token() token: TokenDto,
    @Body() createListOrderHistory: CreateOrderHistoryDto[],
  ) {
    try {
      const getIdsServices = createListOrderHistory.map(
        (item) => item.serviceId,
      );
      const checkListServiceExits: Service[] =
        await this.serviceService.findServiceByIds(getIdsServices);
      if (checkListServiceExits.length != createListOrderHistory.length) {
        throwValidate(
          this.i18n.lang("SERVICE_NOT_FOUND"),
          "Không tìm thấy service",
          ErrorCodes.SERVICE_NOT_FOUND,
        );
      }

      let user: User = await this.userService.findById(token.userId);

      // get total price when checkout
      let getTotalPrice: number = Number(
        createListOrderHistory
          .reduce((accumulator, item) => {
            const priceService = checkListServiceExits.find(
              (service) => service.id == item.serviceId,
            );
            return accumulator + item.amount * priceService.price;
          }, 0)
          .toFixed(5),
      );

      if (Number(user.balanceSys) < Number(getTotalPrice)) {
        throwValidate(
          this.i18n.lang("notEnough"),
          "Bạn không đủ tiền để thanh toán dịch vụ",
          ErrorCodes.NOT_ENOUGH_MONEY,
        );
      }

      //   check total order quantity of the link
      await Promise.all(
        createListOrderHistory.map(async (item) => {
          const service = checkListServiceExits.find(
            (service) => service.id == item.serviceId,
          );
          // check min , max quantity for  for each service
          const { minQuantity, maxQuantity } = service;

          if (item.amount < minQuantity || item.amount > maxQuantity) {
            throwValidate(
              this.i18n.lang("AMOUNT_INVALID"),
              "Số lượng không phù hợp",
              ErrorCodes.AMOUNT_INVALID,
            );
          }

          //   check limit for link when order service limited
          if (
            TypeLimitService.hasOwnProperty(
              service.typeService.toLocaleUpperCase(),
            )
          ) {
            const totalOrder =
              await this.orderHistoryService.getTotalAmountOrderForLink(
                item.link,
                service.id,
              );

            if (Number(totalOrder) + Number(item.amount) > Number(Limit)) {
              throwValidate(
                this.i18n.lang("AMOUNT_INVALID", token.lang),
                "Bạn đã đặt quá số lượng",
                ErrorCodes.AMOUNT_INVALID,
              );
            }
          }
        }),
      );

      // get affiliate person if have affiliate
      const affiliate = createListOrderHistory[0].uplineId;
      let checkUplineUser: User;
      if (affiliate) {
        checkUplineUser = await this.userService.findOne({
          where: {
            refId: affiliate,
          },
        });

        if (!checkUplineUser) {
          throwValidate(
            this.i18n.lang("AFFILIATE_INVALID"),
            "Mã affiliate không hợp lệ",
            ErrorCodes.AFFILIATE_INVALID,
          );
        }

        if (checkUplineUser.id == user.id) {
          throwValidate(
            this.i18n.lang("AFFILIATE_INVALID"),
            "Không lấy mã của bản thân bạn",
            ErrorCodes.AFFILIATE_INVALID,
          );
        }
      }

      //   convert data into list orderservice entity
      const listDataOrderService: OrderHistory[] = createListOrderHistory.map(
        (item) => {
          const service = checkListServiceExits.find(
            (service) => service.id == item.serviceId,
          );
          let price = Number(service.price) * item.amount;
          let discount = 0;
          if (affiliate) {
            discount = this.configService.get<number>("rateUserGetRef");
            price -= price * discount;
          }
          return plainToClass(OrderHistory, {
            ...item,
            service,
            user,
            price: price,
            progress: 0,
            inQueue: true,
            discount,
          });
        },
      );

      //   save data in order history
      const newListOrderHistory = (await this.orderHistoryService.saveBulk(
        listDataOrderService,
      )) as OrderHistory[];

      //   add money for affiliate.
      if (affiliate) {
        let affiliateMoney = 0;

        const rateAffiliate = this.configService.get<number>("rateAffiliate");
        await Promise.all(
          newListOrderHistory.map(async (item) => {
            affiliateMoney += Number(item.price) * rateAffiliate;

            const dataSaveAffiliate = plainToClass(Affiliate, {
              from: user,
              to: checkUplineUser,
              priceService: item.price,
              balanceAffi: Number(item.price) * rateAffiliate,
              content: `User ${user.username} has bought ${item.service.title}`,
            });

            await this.affiliateService.save(dataSaveAffiliate);
          }),
        );
        // update balance affiliate for affiliate person
        checkUplineUser.balanceAffi =
          Number(checkUplineUser.balanceAffi) + affiliateMoney;
        await this.userService.update(checkUplineUser.id, checkUplineUser);

        // Discounts service when  affiliate code valid
        getTotalPrice =
          getTotalPrice -
          getTotalPrice * this.configService.get<number>("rateUserGetRef");
      }

      //   deduct user money
      user.balanceSys -= getTotalPrice;
      await this.userService.save(user);

      //   remove cart if item exist cart
      await Promise.all(
        createListOrderHistory.map(async (item) => {
          if (item.cartId) {
            await this.cartService.delete(item.cartId);
          }
          //   await this.cartService.removeCartByServiceIdAndUserId(
          //     item.serviceId,
          //     user.id,
          //     item.link,
          //   );
        }),
      );

      //   send message and noti
      await this.orderHistoryService.handleNewOrderHistory(newListOrderHistory);
      return newListOrderHistory;
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  /**
   *
   * @param token
   * @param query
   * @returns
   */
  @Get("list-all")
  @SetMetadata("roles", ["user"])
  async getAllOrderHistory(
    @Token() token: TokenDto,
    @Query() query: FilterOrderHistoryDto,
  ) {
    try {
      const result = await this.orderHistoryService.findPaginateOrderHistory(
        query,
        token.userId,
      );
      return result[0];
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  //   for test
  @Get("send-all-order")
  async sendAllOrder() {
    try {
      //   const getAllOrder = await this.orderHistoryService.getAllOrder();
      //   await this.orderHistoryService.handleNewOrderHistory(getAllOrder);

      const a = await this.orderHistoryService.pushProcessingOrder();
      return a;
      return {
        message: "true",
      };
    } catch (error) {
      this.throwErrorProcessNoAuth(error);
    }
  }

  /**
   *
   * @param query
   * @param token
   */
  @Get("export-csv")
  @SetMetadata("roles", ["admin"])
  async exportDataCsv(
    @Query() query: QueryDto,
    @Token() token: TokenDto,
    @Res() res: Response,
  ) {
    try {
      const listAllOrderByDate =
        await this.orderHistoryService.getListOrderByDate(query);

      const headers = [
        "id",
        "email",
        "phoneNumber",
        "link",
        "amount",
        "title",
        "createdAt",
      ];

      let csvContent = [];

      listAllOrderByDate.map((item) => {
        const data = {
          id: item.id,
          email: item.email,
          phoneNumber: item.phoneNumber,
          link: item.link,
          amount: item.amount,
          title: item.title,
          createdAt: item.createdAt,
        };

        csvContent.push(data);
      });

      const startDate = new Date();
      const filePath = `public/${startDate}-all-order.csv`;
      await this.csvService.exportDataToCsv(csvContent, headers, filePath);

      const stream = createReadStream(join(process.cwd(), `${filePath}`));

      res.header("Content-Disposition", `attachment; filename=${filePath}`);
      res.header("Content-Type", "text/csv");

      return res.send(stream);
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }
}
