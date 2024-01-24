import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "src/entities/Cart";
import { Service } from "src/entities/Service";
import { ServiceService } from "../service/service.service";
import { MessageComponent } from "src/components/message.component";
import { User } from "src/entities/User";
import { UserService } from "../user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([Cart,Service,User])],
  controllers: [CartController],
  providers: [CartService,ServiceService,MessageComponent,UserService],
  exports:[CartService]
})

export class CartModule {}
