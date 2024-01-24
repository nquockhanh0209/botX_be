import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/base/base.service";
import { OrderHistory } from "src/entities/OrderHistory";
import { Repository } from "typeorm";
import { RabbitMQService } from "../rabbitmq/rabbitmq.service";
import { FilterOrderHistoryDto } from "./dto/filter-order-history.dto";
import { paginateRawAndEntities } from "nestjs-typeorm-paginate";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Exchanges } from "src/constants/subscribe.const";
import { plainToClass } from "class-transformer";
import { MessageQueueHistoryDto } from "./dto/message-queue-order-history.dto";
import { StatusOrderHistory } from "src/enums/service.enum";
import { GlobalSocket } from "../noti/variable-noti";
import { Noti } from "src/entities/Noti";
import { NotiService } from "../noti/noti.service";
import { Cron } from "@nestjs/schedule";
import { QueryDto } from "src/dtos/query.dto";

@Injectable()
export class OrderHistoryService extends BaseService<OrderHistory> {
  constructor(
    @InjectRepository(OrderHistory)
    private orderHistoryRepository: Repository<OrderHistory>,

    private readonly notiService: NotiService,
    private readonly rabbitMQService: RabbitMQService,
  ) {
    super(orderHistoryRepository);
  }

  /**
   *
   * @param query
   * @returns
   */
  async findPaginateOrderHistory(query: FilterOrderHistoryDto, userId: number) {
    const page = query.page || 0;
    const limit = query.limit || 10;
    const sortBy = query.sortBy || "createdAt";
    const sortType = query.sortType || "DESC";
    const search = query.search || "";
    const statusFilter = query.status || "";

    const queryBuilder = this.orderHistoryRepository
      .createQueryBuilder("orderHistory")
      .leftJoinAndSelect("orderHistory.service", "service")
      .where(`orderHistory.userId = :userId`, { userId });

    if (search) {
      queryBuilder.andWhere("orderHistory.link like :search", {
        search: `%${search}%`,
      });
    }

    if (statusFilter) {
      queryBuilder.andWhere(`"statusOrder" = :statusFilter`, {
        statusFilter,
      });
    }
    queryBuilder.orderBy(`orderHistory.${sortBy}`, sortType);

    return paginateRawAndEntities(queryBuilder, {
      page,
      limit,
    });
  }

  async handleNewOrderHistory(
    listOrders: OrderHistory[],
    noPushNoti?: boolean,
  ) {
    await Promise.all(
      listOrders.map(async (item) => {
        await this.rabbitMQService.sendMessage(
          item,
          Exchanges.WORKER_X,
          item.service.typeService,
        );

        if (!noPushNoti) {
          const dataNoti = {
            userId: item.user.id,
            content: `Order #${item.id}: ${item.service.title}`,
            title: `Your order status has been changed ${item.statusOrder}`,
          };

          await this.notiService.saveNewNoti(dataNoti);
        }
      }),
    );
  }

  async getAllOrder() {
    return this.repository.find({ relations: ["user", "service"] });
  }

  /**
   *
   * @param msg
   */
  @RabbitSubscribe({
    exchange: Exchanges.MAIN_X,
    routingKey: "subscribe-main-router",
    queue: "subscribe-main-queue",
  })
  async competingPubSubHandler(msg: any): Promise<void> {
    console.log(msg, "msg");
    const dataMessage = plainToClass(MessageQueueHistoryDto, msg);
    // update pregress orderhistory
    const getOrderHistoryOfUser: OrderHistory =
      await this.orderHistoryRepository
        .createQueryBuilder()
        .where('id = :orderHistoryId AND "userId" = :userId', {
          userId: dataMessage.userId,
          orderHistoryId: dataMessage.orderHistoryId,
        })
        .getOne();

    console.log(getOrderHistoryOfUser, "getOrderHistoryOfUser");
    getOrderHistoryOfUser.progress += dataMessage?.progress || 0;

    // update status
    if (getOrderHistoryOfUser.progress >= getOrderHistoryOfUser.amount)
      getOrderHistoryOfUser.statusOrder = StatusOrderHistory.DONE;
    else if (getOrderHistoryOfUser.progress > 0)
      getOrderHistoryOfUser.statusOrder = StatusOrderHistory.PROCESSING;
    else getOrderHistoryOfUser.statusOrder = StatusOrderHistory.ACTIVE;

    if (dataMessage.error) {
      getOrderHistoryOfUser.statusOrder = StatusOrderHistory.ERROR;
    }

    getOrderHistoryOfUser.inQueue = false;
    await this.repository.update(
      getOrderHistoryOfUser.id,
      getOrderHistoryOfUser,
    );

    // Noti
    // const titleService: string = getOrderHistoryOfUser.service.title;
    const dataNoti = {
      userId: dataMessage.userId,
      title: `Order #${getOrderHistoryOfUser.id} is ${getOrderHistoryOfUser.statusOrder}`,
      content: `Your order status has been changed ${getOrderHistoryOfUser.statusOrder}`,
    };

    // create noti and send socket to client
    await this.notiService.saveNewNoti(dataNoti);
  }

//   @Cron("0 */3 * * *")
  async pushProcessingOrder() {
    // get all listorder has status processing
    const listOrders: OrderHistory[] = await this.orderHistoryRepository.find({
      where: {
        statusOrder: StatusOrderHistory.PROCESSING,
        inQueue: false,
      },
      relations: {
        service: true,
        user: true,
      },
      order: {
        updatedAt: "ASC",
      },
      take: 50,
    });

    // No push noti
    await this.handleNewOrderHistory(listOrders, true);
  }

  /**
   *
   * @param query
   * @returns
   */
  async getListOrderByDate(query: QueryDto) {
    const startDate = query.startDate;
    const endDate = query.endDate;

    const queryBuilder = this.repository
      .createQueryBuilder("orderHistory")
      .leftJoin("orderHistory.user", "user")
      .leftJoin("orderHistory.service", "service")
      .select("user.email", "email")
      .addSelect("orderHistory.id", "id")
      .addSelect("user.phoneNumber", "phoneNumber")
      .addSelect("orderHistory.link", "link")
      .addSelect("orderHistory.amount", "amount")
      .addSelect("service.title", "title")
      .addSelect("orderHistory.createdAt", "createdAt");

    if (startDate && endDate) {
      queryBuilder.where(
        "orderHistory.createdAt >= :startDate and orderHistory.createdAt <= :endDate",
        {
          startDate,
          endDate,
        },
      );
    }

    queryBuilder.orderBy("orderHistory.createdAt", "DESC");

    return queryBuilder.getRawMany();
  }

  /**
   * get total order of link
   * @param link
   * @returns
   */
  async getTotalAmountOrderForLink(link: string, serviceId: number) {
    const queryBuilder = this.repository
      .createQueryBuilder()
      .select("SUM(amount)", "totalAmount")
      .where('link = :link AND "serviceId" = :serviceId', {
        link,
        serviceId,
      });

    queryBuilder.groupBy("link");
    const resultQuery = await queryBuilder.getRawOne();

    return resultQuery ? resultQuery["totalAmount"] : 0;
  }
}
