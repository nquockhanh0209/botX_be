import { Module } from "@nestjs/common";
import { NotiController } from "./noti.controller";
import { NotiService } from "./noti.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Noti } from "src/entities/Noti";
import { NotiGateway } from "./noti.gateway";
import { AuthModule } from "../auth/auth.module";
import { User } from "src/entities/User";
import { MessageComponent } from "src/components/message.component";

@Module({
  imports: [TypeOrmModule.forFeature([Noti,User]),AuthModule],
  controllers: [NotiController],
  providers: [NotiService,NotiGateway,MessageComponent],
  exports: [NotiService],
})
export class NotiModule {}
