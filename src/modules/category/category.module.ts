import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/entities/Category";
import { MessageComponent } from "src/components/message.component";

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService,MessageComponent],
})
export class CategoryModule {}
