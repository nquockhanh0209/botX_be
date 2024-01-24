import { Module } from "@nestjs/common";
import { ServiceController } from "./service.controller";
import { ServiceService } from "./service.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Service } from "src/entities/Service";
import { MessageComponent } from "src/components/message.component";
import RedisComponent from "src/components/redis.component";
import { UserFavouriteService } from "../user-favourite/user-favourite.service";
import { UserFavourite } from "src/entities/UserFavourite";
import { User } from "src/entities/User";
import { UserService } from "../user/user.service";
import { Category } from "src/entities/Category";
import { CategoryService } from "../category/category.service";

@Module({
  imports: [TypeOrmModule.forFeature([Service, UserFavourite,User,Category])],
  controllers: [ServiceController],
  providers: [
    ServiceService,
    MessageComponent,
    RedisComponent,
    UserFavouriteService,
    UserService,
    CategoryService
  ],
  exports: [ServiceService],
})
export class ServiceModule {}
