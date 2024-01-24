import { Module } from "@nestjs/common";
import { OrderHistoryService } from "./order-history.service";
import { OrderHistoryController } from "./order-history.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderHistory } from "src/entities/OrderHistory";
import { Service } from "src/entities/Service";
import { User } from "src/entities/User";
import { ServiceService } from "../service/service.service";
import { UserService } from "../user/user.service";
import { MessageComponent } from "src/components/message.component";
import { Cart } from "src/entities/Cart";
import { CartService } from "../cart/cart.service";
import { RabbitMQService } from "../rabbitmq/rabbitmq.service";
import { RabbitMQ } from "../rabbitmq/rabbitmq.module";
import { Noti } from "src/entities/Noti";
import { NotiService } from "../noti/noti.service";
import { AffiliateService } from "../affiliate/affiliate.service";
import { Affiliate } from "src/entities/Affiliate";
import { CsvService } from "../csv/csv.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderHistory, Service, User, Cart, Noti,Affiliate]),
    RabbitMQ,
  ],
  providers: [
    OrderHistoryService,
    ServiceService,
    UserService,
    MessageComponent,
    CartService,
    NotiService,
    AffiliateService,
    CsvService
  ],
  controllers: [OrderHistoryController],
  exports: [OrderHistoryService],
})
export class OrderHistoryModule {}
