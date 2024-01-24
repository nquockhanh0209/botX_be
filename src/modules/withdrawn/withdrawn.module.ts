import { Module } from "@nestjs/common";
import { WithdrawnController } from "./withdrawn.controller";
import { WithdrawnService } from "./withdrawn.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Withdrawn } from "src/entities/Withdrawn";
import { MessageComponent } from "src/components/message.component";
import { User } from "src/entities/User";
import { UserService } from "../user/user.service";
import { Noti } from "src/entities/Noti";
import { NotiService } from "../noti/noti.service";

@Module({
  imports: [TypeOrmModule.forFeature([Withdrawn,User,Noti])],
  controllers: [WithdrawnController],
  providers: [WithdrawnService, MessageComponent,UserService,NotiService],
  exports: [WithdrawnService],
})
export class WithdrawnModule {}
