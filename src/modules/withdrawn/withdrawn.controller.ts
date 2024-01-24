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
import { WithdrawnService } from "./withdrawn.service";
import { Token } from "src/decorators/token.decorator";
import { TokenDto } from "src/dtos/token.dto";
import { UserService } from "../user/user.service";
import { CreateWithdrawnDto } from "./dto/craete-withdrawn.dto";
import { User } from "src/entities/User";
import { throwValidate } from "src/utils/throw-exception.util";
import { ErrorCodes } from "src/constants/error-code.const";
import { ConfigService } from "@nestjs/config";
import { Withdrawn } from "src/entities/Withdrawn";
import { plainToClass } from "class-transformer";
import { StatusWithdrawnDto } from "./dto/status-withdrawn.dto";
import { ParseIntPipe1 } from "src/validators/parse-int.pipe";
import { PaymentStatus } from "src/enums/payment.enum";
import { CreateNotiInterface } from "src/interfaces/noti.interface";
import { NotiService } from "../noti/noti.service";
import { QueryDto } from "src/dtos/query.dto";
import { FilterWithdrawDto } from "./dto/filter-withdraw.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller("withdrawn")
@ApiTags("Withdrawn")
@ApiBearerAuth()
export class WithdrawnController extends BaseController {
  constructor(
    private i18n: MessageComponent,
    private readonly withdrawnService: WithdrawnService,
    private readonly userService: UserService,
    private readonly notiService: NotiService,

    private readonly configService: ConfigService,
  ) {
    super(i18n);
  }

  /**
   *
   * @param token
   * @param createWithdrawn
   * @returns
   */
  @Post("create-withdrawn")
  @SetMetadata("roles", ["user"])
  async createTransaction(
    @Token() token: TokenDto,
    @Body() createWithdrawn: CreateWithdrawnDto,
  ) {
    try {
      const user: User = await this.userService.findById(token.userId);

      if (!user.accountName || !user.accountNumber || !user.bankName) {
        throwValidate(
          "MISSING_BANKING_INFO",
          "Thiếu thông tin ngân hàng",
          ErrorCodes.MISSING_BANKING_INFO,
        );
      }

      if (Number(user.balanceAffi) < createWithdrawn.balanceAffiWithdrawn) {
        throwValidate(
          "NOT_ENOUTH_BALANCE_AFFILIATE",
          "Không đủ tiền affiliate",
          ErrorCodes.NOT_ENOUTH_BALANCE_AFFILIATE,
        );
      }
      const amountVnd = (
        createWithdrawn.balanceAffiWithdrawn *
        this.configService.get<number>("exchangeRateWithdrawn")
      ).toFixed(3);

      const dataSave = plainToClass(Withdrawn, {
        user: user,
        balanceAffiWithdrawn: createWithdrawn.balanceAffiWithdrawn,
        amountVnd: Number(amountVnd),
        bankName: user.bankName,
        accountName: user.accountName,
        accountNumber: user.accountNumber,
        content: createWithdrawn.content,
      });
      const newWithdrawn: Withdrawn = await this.withdrawnService.save(
        dataSave,
      );
      return newWithdrawn;
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  @Put("update-status/:id")
  @SetMetadata("roles", ["admin"])
  async updateStatusWithdrawn(
    @Token() token: TokenDto,
    @Body() statusWithdrawn: StatusWithdrawnDto,
    @Param("id", ParseIntPipe1) id: number,
  ) {
    try {
      const checkWithdrawn: Withdrawn =
        await this.withdrawnService.findWithdrawnLeftJoinUser(id);
      if (!checkWithdrawn) {
        throwValidate(
          this.i18n.lang("TRANSACTION_NOT_EXIST"),
          "Không tìm thấy giao dịch",
          ErrorCodes.TRANSACTION_NOT_EXIST,
        );
      }

      if (statusWithdrawn.status == PaymentStatus.DONE) {
        const user: User = checkWithdrawn.user;
        user.balanceAffi =
          Number(user.balanceAffi) -
          Number(checkWithdrawn.balanceAffiWithdrawn);
        await this.userService.update(user.id, user);
      }

      //   update status payment
      checkWithdrawn.statusWithdrawn = statusWithdrawn.status;
      await this.withdrawnService.update(id, checkWithdrawn);

      //   send noti
      const content: string =
        statusWithdrawn.status == PaymentStatus.DONE
          ? "Your transaction is successful"
          : "Your transaction has been cancelled";
      const dataNoti: CreateNotiInterface = {
        userId: checkWithdrawn.user.id,
        title: `Transaction #${checkWithdrawn.id} has been converted into ${checkWithdrawn.statusWithdrawn}`,
        content,
      };
      await this.notiService.saveNewNoti(dataNoti);

      return checkWithdrawn;
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
  @Get("list-my-withdrawns")
  @SetMetadata("roles", ["user"])
  async getMyListTransaction(
    @Token() token: TokenDto,
    @Query() query: QueryDto,
  ) {
    try {
      const reslut = await this.withdrawnService.findPaginateMyWithdrawns(
        query,
        token.userId,
      );
      return reslut;
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
  @Get("all-withdrawns")
  @SetMetadata("roles", ["admin"])
  async getAllTransactions(
    @Token() token: TokenDto,
    @Query() query: FilterWithdrawDto,
  ) {
    try {
      const result = await this.withdrawnService.findPaginateAllTransaction(
        query,
      );
      return result[0];
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }
}
