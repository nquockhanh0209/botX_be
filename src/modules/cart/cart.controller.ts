import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  SetMetadata,
} from "@nestjs/common";
import { BaseController } from "src/base/base.controller";
import { MessageComponent } from "src/components/message.component";
import { CartService } from "./cart.service";
import { ServiceService } from "../service/service.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { TokenDto } from "src/dtos/token.dto";
import { Token } from "src/decorators/token.decorator";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { Service } from "src/entities/Service";
import { throwValidate } from "src/utils/throw-exception.util";
import { ErrorCodes } from "src/constants/error-code.const";
import { Cart } from "src/entities/Cart";
import { plainToClass } from "class-transformer";
import { UpdateCartDto } from "./dto/update-cart";
import { ParseIntPipe1 } from "src/validators/parse-int.pipe";
import { QueryDto } from "src/dtos/query.dto";
import { UserService } from "../user/user.service";
import { User } from "src/entities/User";
import { IsNull } from "typeorm";

@ApiBearerAuth()
@Controller("cart")
@ApiTags("Cart")
export class CartController extends BaseController {
  constructor(
    private i18n: MessageComponent,
    private readonly serviceService: ServiceService,
    private readonly cartService: CartService,
    private readonly userService: UserService,
  ) {
    super(i18n);
  }

  /**
   *
   * @param addToCart
   * @param token
   * @returns
   */
  @Post("create")
  @SetMetadata("roles", ["user"])
  async createCart(@Body() addToCart: AddToCartDto, @Token() token: TokenDto) {
    try {
      const checkService: Service = await this.serviceService.findById(
        addToCart.serviceId,
      );
      if (!checkService) {
        throwValidate(
          this.i18n.lang("SERVICE_NOT_FOUND"),
          "Không tìm thấy service",
          ErrorCodes.SERVICE_NOT_FOUND,
        );
      }

      const checkCartExist: Cart = await this.cartService.findOne({
        where: {
          "user.id": token.userId,
          "service.id": checkService.id,
          link: addToCart.link || IsNull(),
        },
      });

      let newCart: Cart = null;

      //   incree quantity + 1 if item exits in my cart
      if (checkCartExist) {
        const dataUpdateCart = plainToClass(Cart, {
          quantity: addToCart.quantity
            ? checkCartExist.quantity + addToCart.quantity
            : checkCartExist.quantity + 1,
        });

        newCart = await this.cartService.update(
          checkCartExist.id,
          dataUpdateCart,
        );
      } else {
        const user: User = await this.userService.findById(token.userId);
        const dataSave: Cart = plainToClass(Cart, {
          service: checkService,
          user: {
            id: token.userId,
          },
          quantity: addToCart.quantity ? addToCart.quantity : 1,
          link: addToCart.link,
        });
        newCart = await this.cartService.save(dataSave);
      }

      return {
        message: "Add item to cart success",
      };
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  /**
   *
   * @param updateToCart
   * @param id
   * @param token
   * @returns
   */
  @Put("update/:id")
  @SetMetadata("roles", ["user"])
  async updateCart(
    @Body() updateToCart: UpdateCartDto,
    @Param("id", ParseIntPipe1) id: number,
    @Token() token: TokenDto,
  ) {
    try {
      const checkCartItemExits = await this.cartService.findById(id);
      if (!checkCartItemExits) {
        throwValidate(
          this.i18n.lang("ITEM_CART_NOT_FOUND"),
          "Không tìm thấy sản phẩm trong giỏ hàng",
          ErrorCodes.ITEM_CART_NOT_FOUND,
        );
      }
      const dataUpdateCart = plainToClass(Cart, updateToCart);
      const newItemCart = await this.cartService.update(id, dataUpdateCart);

      return newItemCart;
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  /**
   *
   * @param token
   * @param id
   * @returns
   */
  @Delete("remove/:id")
  @SetMetadata("roles", ["user"])
  async removeCart(
    @Token() token: TokenDto,
    @Param("id", ParseIntPipe1) id: number,
  ) {
    try {
      const checkCartItemExits = await this.cartService.findById(id);
      if (!checkCartItemExits) {
        throwValidate(
          this.i18n.lang("ITEM_CART_NOT_FOUND"),
          "Không tìm thấy sản phẩm trong giỏ hàng",
          ErrorCodes.ITEM_CART_NOT_FOUND,
        );
      }
      await this.cartService.delete(id);
      return {
        message: "Delete item in cart success",
      };
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  /**
   *
   * @param token
   * @param query
   * @returns
   */
  @Get("all")
  @SetMetadata("roles", ["user"])
  async getAllCart(@Token() token: TokenDto, @Query() query: QueryDto) {
    try {
      const dataPaginateEntity = await this.cartService.findPaginateAllCarts(
        query,
        token.userId,
      );
      return dataPaginateEntity[0];
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }
}
