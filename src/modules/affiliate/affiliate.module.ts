import { Module } from "@nestjs/common";
import { AffiliateController } from "./affiliate.controller";
import { AffiliateService } from "./affiliate.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Affiliate } from "src/entities/Affiliate";
import { MessageComponent } from "src/components/message.component";
import { User } from "src/entities/User";
import { UserService } from "../user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([Affiliate,User])],
  controllers: [AffiliateController],
  providers: [AffiliateService, MessageComponent,UserService],
  exports: [AffiliateService],
})
export class AffiliateModule {}
