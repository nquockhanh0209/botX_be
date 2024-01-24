import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  SetMetadata,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/base/base.controller";
import RedisComponent from "src/components/redis.component";
import { Token } from "src/decorators/token.decorator";
import { TokenDto } from "src/dtos/token.dto";
import { UserService } from "./user.service";
import { MessageComponent } from "src/components/message.component";
import { User } from "src/entities/User";
import { throwValidate } from "src/utils/throw-exception.util";
import { ErrorCodes } from "src/constants/error-code.const";
import { UpdateInfoUserDto } from "./dto/update-info-user.dto";
import { plainToClass } from "class-transformer";
import md5 from "md5";
import { trim } from "src/utils/general.util";
import { QueryDto } from "src/dtos/query.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ParseIntPipe1 } from "src/validators/parse-int.pipe";
import { CsvService } from "../csv/csv.service";
import { createReadStream } from "fs";
import { join } from "path";
import type { Response } from "express";

@Controller("user")
@ApiTags("User")
@ApiBearerAuth()
export class UserController extends BaseController {
  constructor(
    private readonly userService: UserService,
    private readonly redis: RedisComponent,

    private i18n: MessageComponent,
    private readonly csvService: CsvService,
  ) {
    super(i18n);
  }

  /**
   *
   * @param token
   * @returns
   */
  @Get("info")
  @SetMetadata("roles", ["user"])
  async getInfoUser(@Token() token: TokenDto) {
    try {
      const user = await this.userService.findOneUser(token.userId);
      if (!user) {
        throwValidate(
          this.i18n.lang("USER_NOT_EXIST"),
          "Không tìm thấy user",
          ErrorCodes.USER_NOT_EXIST,
        );
      }
      //   Format data user remove SnakeCase when join
      const formatDataUser: Record<string, unknown> = {};
      Object.keys(user).forEach((key) => {
        formatDataUser[trim(key, "user" + "_", true)] = user[key];
      });
      return formatDataUser;
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  /**
   *
   * @param updateInfoUser
   * @param token
   * @returns
   */
  @Put("update-info")
  @SetMetadata("roles", ["user"])
  async updateInfoUser(
    @Body() updateInfoUser: UpdateInfoUserDto,
    @Token() token: TokenDto,
  ) {
    try {
      const checkUserExist: User = await this.userService.findById(
        token.userId,
      );
      if (!checkUserExist) {
        throwValidate(
          this.i18n.lang("USER_NOT_EXIST"),
          "Không tìm thấy user",
          ErrorCodes.USER_NOT_EXIST,
        );
      }

      if (
        updateInfoUser.newPassword &&
        checkUserExist.password &&
        md5(updateInfoUser.currentPassword) != checkUserExist.password
      ) {
        throwValidate(
          this.i18n.lang("PASSWORD_IS_INCORRECT"),
          "Mật khẩu xác thực không chính xác",
          ErrorCodes.PASSWORD_IS_INCORRECT,
        );
      }

      if (
        updateInfoUser.email &&
        updateInfoUser.email != checkUserExist.email
      ) {
        // If user has already mail then can't edit
        if (checkUserExist.email) {
          throwValidate(
            this.i18n.lang("CAN_NOT_EDIT_MAIL"),
            "Bạn không thể sửa thông tin của email",
            ErrorCodes.CAN_NOT_EDIT_MAIL,
          );
        }

        const checkEmailExist = await this.userService.findOne({
          where: {
            email: updateInfoUser.email,
          },
        });
        if (checkEmailExist) {
          throwValidate(
            this.i18n.lang("EMAIL_ALREADY_EXIST"),
            "Email đã tồn tại",
            ErrorCodes.EMAIL_ALREADY_EXIST,
          );
        }
      }

      if (
        updateInfoUser.phoneNumber &&
        updateInfoUser.phoneNumber != checkUserExist.phoneNumber
      ) {
        // If user has already phone_number then can't edit

        if (checkUserExist.phoneNumber) {
          throwValidate(
            this.i18n.lang("CAN_NOT_EDIT_PHONE_NUMBER"),
            "Bạn không thể sửa thông tin của số điện thoại",
            ErrorCodes.CAN_NOT_EDIT_PHONE_NUMBER,
          );
        }

        const checkPhoneNumberExist: User = await this.userService.findOne({
          where: {
            phoneNumber: updateInfoUser.phoneNumber,
          },
        });

        if (checkPhoneNumberExist) {
          throwValidate(
            this.i18n.lang("PHONE_NUMBER_ALREADY_EXIST", token.lang),
            "Số điện thoại đã tồn tại",
            ErrorCodes.PHONE_NUMBER_ALREADY_EXIST,
          );
        }
        if (!updateInfoUser.newPassword) {
          throwValidate(
            this.i18n.lang("PASSWORD_REQUIRE"),
            "Bạn cần phải nhập password",
            ErrorCodes.PASSWORD_REQUIRE,
          );
        }
      }

      let dataUpdate = plainToClass(User, {
        ...updateInfoUser,
        password: updateInfoUser.newPassword
          ? md5(updateInfoUser.newPassword)
          : checkUserExist.password,
      });
      if (checkUserExist.phoneNumber) {
        dataUpdate.phoneNumber = checkUserExist.phoneNumber;
      }
      if (checkUserExist.email) {
        dataUpdate.email = checkUserExist.email;
      }
      delete dataUpdate["currentPassword"];
      delete dataUpdate["newPassword"];

      const newInfoUser = await this.userService.update(
        token.userId,
        dataUpdate,
      );

      return newInfoUser;
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
  @Get("all-user")
  @SetMetadata("roles", ["admin"])
  @ApiOperation({ summary: "get all user by admin" })
  async getAllAdmin(@Token() token: TokenDto, @Query() query: QueryDto) {
    try {
      const result = await this.userService.findAllUser(query);
      //   Format data user remove SnakeCase when join
      const data = result.items.map((user) => {
        const formatDataUser: Record<string, unknown> = {};
        Object.keys(user).forEach((key) => {
          formatDataUser[trim(key, "user" + "_", true)] = user[key];
        });
        return formatDataUser;
      });

      return { ...result, items: data };
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  /**
   *
   * @param token
   * @param updateUser
   * @param id
   * @returns
   */
  @Put(":id")
  @SetMetadata("roles", ["admin"])
  @ApiOperation({ summary: "Upload user by admin" })
  async updateInfoUserByAdmin(
    @Token() token: TokenDto,
    @Body() updateUser: UpdateUserDto,
    @Param("id", ParseIntPipe1) id: number,
  ) {
    try {
      const checkUserExist = await this.userService.findById(id);
      if (!checkUserExist) {
        throwValidate(
          this.i18n.lang("USER_NOT_EXIST"),
          "Không tìm thấy user",
          ErrorCodes.USER_NOT_EXIST,
        );
      }

      if (updateUser.phoneNumber) {
        const checkPhoneNumberExist: User = await this.userService.findOne({
          where: {
            email: updateUser.phoneNumber,
          },
        });

        if (checkPhoneNumberExist.id != checkUserExist.id) {
          throwValidate(
            this.i18n.lang("PHONE_NUMBER_ALREADY_EXIST"),
            "Số điện thoại đã tồn tại",
            ErrorCodes.PHONE_NUMBER_ALREADY_EXIST,
          );
        }
      }

      if (updateUser.email) {
        const checkEmailExist = await this.userService.findOne({
          where: {
            email: updateUser.email,
          },
        });
        if (checkUserExist.id != checkEmailExist.id) {
          throwValidate(
            this.i18n.lang("EMAIL_ALREADY_EXIST"),
            "Email đã tồn tại",
            ErrorCodes.EMAIL_ALREADY_EXIST,
          );
        }
      }

      let dataUpdate = plainToClass(User, {
        ...updateUser,
        password: updateUser.password ? md5(updateUser.password) : null,
      });
      if (!checkUserExist.phoneNumber) {
        dataUpdate.phoneNumber = checkUserExist.phoneNumber;
      }
      if (!checkUserExist.email) {
        dataUpdate.email = checkUserExist.email;
      }
      const newInfoUser = await this.userService.update(
        checkUserExist.id,
        dataUpdate,
      );

      return newInfoUser;
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }

  @Get("export-csv-no-order")
  @SetMetadata("roles", ["admin"])
  async getUserNoOrder(
    @Query() query: QueryDto,
    @Token() token: TokenDto,
    @Res() res: Response,
  ) {
    try {
      const listUserNotOrder = await this.userService.findListUserNotOrder(
        query,
      );

      const headers = ["email", "createdAt"];

      let csvContent = [];

      listUserNotOrder.map((item) => {
        const data = {
          email: item.email,
          createdAt: item.createdAt,
        };

        csvContent.push(data);
      });

      const startDate = new Date();
      const filePath = `public/${startDate}-user-not-order.csv`;
      await this.csvService.exportDataToCsv(csvContent, headers, filePath);

      const stream = createReadStream(join(process.cwd(), `${filePath}`));

      res.header("Content-Disposition", `attachment; filename=${filePath}`);
      res.header("Content-Type", "text/csv");

      return res.send(stream);
    } catch (error) {
      this.throwErrorProcess(error, token);
    }
  }
}
