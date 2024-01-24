import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  SetMetadata,
} from "@nestjs/common";
import { BaseController } from "src/base/base.controller";
import { MessageComponent } from "src/components/message.component";
import { CategoryService } from "./category.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TokenDto } from "src/dtos/token.dto";
import { Token } from "src/decorators/token.decorator";
import { CreateOrUpdateCategoryDto } from "./dto/create-update-category.dto";
import { Category } from "src/entities/Category";
import { ParseIntPipe1 } from "src/validators/parse-int.pipe";
import { throwValidate } from "src/utils/throw-exception.util";
import { ErrorCodes } from "src/constants/error-code.const";
import { plainToClass } from "class-transformer";

@Controller("category")
@ApiTags("Category")
export class CategoryController extends BaseController {
  constructor(
    private i18n: MessageComponent,
    private readonly categoryService: CategoryService,
  ) {
    super(i18n);
  }

  @Post("create")
  @ApiBearerAuth()
  @ApiOperation({ summary: "create category for admin " })
  @SetMetadata("roles", ["admin"])
  async createCategory(
    @Token() token: TokenDto,
    @Body() createCategory: CreateOrUpdateCategoryDto,
  ) {
    try {
      const newCategory: Category = await this.categoryService.save(
        createCategory as Category,
      );

      return newCategory;
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  @Put("update/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "update category for admin " })
  @SetMetadata("roles", ["admin"])
  async updateCategory(
    @Token() token: TokenDto,
    @Body() createCategory: CreateOrUpdateCategoryDto,
    @Param("id", ParseIntPipe1) id: number,
  ) {
    try {
      const checkCategory = await this.categoryService.findById(id);
      if (!checkCategory) {
        throwValidate(
          this.i18n.lang("CATEGORY_NOT_EXITS"),
          "Thể loại không tồn tại",
          ErrorCodes.CATEGORY_NOT_EXITS,
        );
      }
      const dataUpdate = plainToClass(Category, {
        title: createCategory.title,
      });
      const newUpdateCategory = await this.categoryService.update(
        id,
        dataUpdate,
      );

      return newUpdateCategory;
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  @Delete("delete/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "delete category for admin " })
  @SetMetadata("roles", ["admin"])
  async deleteCategory(
    @Token() token: TokenDto,
    @Param("id", ParseIntPipe1) id: number,
  ) {
    try {
      const checkCategory = await this.categoryService.findById(id);
      if (!checkCategory) {
        throwValidate(
          this.i18n.lang("CATEGORY_NOT_EXITS"),
          "Thể loại không tồn tại",
          ErrorCodes.CATEGORY_NOT_EXITS,
        );
      }
      await this.categoryService.delete(id);

      return {
        message: "Delete category sucess",
      };
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  @Get("all")
  async getAllCategory() {
    try {
      const listCategories: Category[] = await this.categoryService.findAll();
      return listCategories;
    } catch (error) {
      this.throwErrorProcessNoAuth(error);
    }
  }
}
