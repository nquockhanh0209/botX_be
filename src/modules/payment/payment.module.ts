import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "src/entities/Payment";
import { MessageComponent } from "src/components/message.component";
import { User } from "src/entities/User";
import { UserService } from "../user/user.service";
import { NotiService } from "../noti/noti.service";
import { Noti } from "src/entities/Noti";

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User, Noti])],
  providers: [PaymentService, MessageComponent, UserService, NotiService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
