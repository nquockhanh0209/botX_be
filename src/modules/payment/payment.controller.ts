import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  SetMetadata,
} from "@nestjs/common";
import { BaseController } from "src/base/base.controller";
import { MessageComponent } from "src/components/message.component";
import { PaymentService } from "./payment.service";
import { Token } from "src/decorators/token.decorator";
import { TokenDto } from "src/dtos/token.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { User } from "src/entities/User";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";
import { PaymentStatus } from "src/enums/payment.enum";
import { plainToClass } from "class-transformer";
import { Payment } from "src/entities/Payment";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { StatusPaymentDto } from "./dto/update-status-pay-ment-dto";
import { ParseIntPipe1 } from "src/validators/parse-int.pipe";
import { throwValidate } from "src/utils/throw-exception.util";
import { ErrorCodes } from "src/constants/error-code.const";
import { NotiService } from "../noti/noti.service";
import { CreateNotiInterface } from "src/interfaces/noti.interface";
import { QueryDto } from "src/dtos/query.dto";
import { FilterTransactionDto } from "./dto/filter-transaction.dto";
import { CURRENCY_VALUE } from "src/constants/currency.const";

@Controller("payment")
@ApiTags("Payment")
@ApiBearerAuth()
export class PaymentController extends BaseController {
  constructor(
    private i18n: MessageComponent,
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly notiService: NotiService,
  ) {
    super(i18n);
  }

  /**
   *
   * @param token
   * @param createTransaction
   * @returns
   */
  @Post("create-pay-ment")
  @SetMetadata("roles", ["user"])
  async createTransaction(
    @Token() token: TokenDto,
    @Body() createTransaction: CreateTransactionDto,
  ) {
    try {
      const user: User = await this.userService.findById(token.userId);
      const currency = CURRENCY_VALUE.find(
        (item) => item.name == createTransaction.currency,
      );

      if (!currency) {
        throwValidate(
          this.i18n.lang("CURRENCY_INVALID"),
          "Tiền nạp không hợp lệ",
          ErrorCodes.CURRENCY_INVALID,
        );
      }

      const amountSys = (
        createTransaction.amountDeposit * currency.rate
      ).toFixed(3);

      const dataSave = plainToClass(Payment, {
        user: user,
        amountSys: Number(amountSys),
        amountDeposit: createTransaction.amountDeposit,
        txHash: createTransaction.txHash || null,
        currency: createTransaction.currency,
      });
      const newTransactions: Payment = await this.paymentService.save(dataSave);
      newTransactions.content = `Payment_X_${newTransactions.id}_${newTransactions.user.id}`;
      //   Update content after creat
      await this.paymentService.update(newTransactions.id, newTransactions);
      return newTransactions;
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  /**
   *
   * @param token
   * @param statusPayment
   * @param id
   */
  @Put("update-status/:id")
  @SetMetadata("roles", ["admin"])
  async updateStatusPayment(
    @Token() token: TokenDto,
    @Body() statusPayment: StatusPaymentDto,
    @Param("id", ParseIntPipe1) id: number,
  ) {
    try {
      const checkPayment: Payment =
        await this.paymentService.findTransactionLeftJoinUser(id);
      if (!checkPayment) {
        throwValidate(
          this.i18n.lang("TRANSACTION_NOT_EXIST"),
          "Không tìm thấy giao dịch",
          ErrorCodes.TRANSACTION_NOT_EXIST,
        );
      }

      if (statusPayment.status == PaymentStatus.DONE) {
        const user: User = checkPayment.user;
        user.balanceSys =
          Number(user.balanceSys) + Number(checkPayment.amountSys);
        await this.userService.update(user.id, user);
      }

      //   update status payment
      checkPayment.statusPayment = statusPayment.status;
      await this.paymentService.update(id, checkPayment);

      //   send noti
      const content: string =
        statusPayment.status == PaymentStatus.DONE
          ? "Your transaction is successful"
          : "Your transaction has been cancelled";
      const dataNoti: CreateNotiInterface = {
        userId: checkPayment.user.id,
        title: `Transaction #${checkPayment.id} has been converted into ${checkPayment.statusPayment}`,
        content,
      };
      await this.notiService.saveNewNoti(dataNoti);

      return checkPayment;
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
  @Get("list-my-transactions")
  @SetMetadata("roles", ["user"])
  async getMyListTransaction(
    @Token() token: TokenDto,
    @Query() query: QueryDto,
  ) {
    try {
      const reslut = await this.paymentService.findPaginateMyTransaction(
        query,
        token.userId,
      );
      return { ...reslut, currency: CURRENCY_VALUE };
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
  @Get("all-transactions")
  @SetMetadata("roles", ["admin"])
  async getAllTransactions(
    @Token() token: TokenDto,
    @Query() query: FilterTransactionDto,
  ) {
    try {
      const result = await this.paymentService.findPaginateAllTransaction(
        query,
      );
      return result[0];
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }
}
