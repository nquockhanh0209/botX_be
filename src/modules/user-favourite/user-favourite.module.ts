import { Module } from "@nestjs/common";
import { UserFavouriteController } from "./user-favourite.controller";
import { UserFavouriteService } from "./user-favourite.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserFavourite } from "src/entities/UserFavourite";
import { MessageComponent } from "src/components/message.component";
import { Service } from "src/entities/Service";
import { ServiceService } from "../service/service.service";
import { User } from "src/entities/User";
import { UserService } from "../user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserFavourite, Service, User])],
  controllers: [UserFavouriteController],
  providers: [
    UserFavouriteService,
    MessageComponent,
    ServiceService,
    UserService,
  ],
  exports: [UserFavouriteService],
})
export class UserFavouriteModule {}
