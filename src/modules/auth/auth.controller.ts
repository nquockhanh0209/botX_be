import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import md5 from "md5";
import { BaseController } from "src/base/base.controller";
import RedisComponent from "src/components/redis.component";
import { ErrorCodes } from "src/constants/error-code.const";
import { RefreshToken } from "src/entities/RefreshToken";
import { ValidateError } from "src/exceptions/errors/validate.error";
import { generateId } from "src/utils/id-generator.util";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { RenewTokenDto } from "./dto/renew-token.dto";
import { TokenGoogleOAuthDto } from "./dto/token-oauth.dto";
import { EventUser, Roles } from "src/enums/user.enum";
import { User } from "src/entities/User";
import { MessageComponent } from "src/components/message.component";
import { BadRequestException } from "src/exceptions/errors/bad-request.error";
import { throwBadRequest, throwValidate } from "src/utils/throw-exception.util";
import { RegisterOrLoginUserDto } from "./dto/register-user.dto";
import { telephoneCheckAndGet } from "src/utils/general.util";
import { LoginUserDto } from "./dto/login.dto";
import { LoginAdminDto } from "./dto/login-admin.dto";

@Controller("auth")
@ApiTags("Auth")
export class AuthController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    protected readonly configService: ConfigService,
    private readonly redis: RedisComponent,
    private i18n: MessageComponent,
  ) {
    super(i18n);
  }

  @Post("/google/login")
  async googleLogin(@Body() tokenId: TokenGoogleOAuthDto) {
    try {
      const profileUserLoginGoogle = await this.authService.loginGoogleUser(
        tokenId.tokenIdOAuth,
      );
      const { email, name, picture } = profileUserLoginGoogle;
      const checkUserExists = await this.userService.findUserByEmail(email);

      let user: User = null;
      if (!checkUserExists) {
        // userTypeId:1 for user
        const refId = this.createNewHash(1);

        // If the user registers in December, 1.44usd will be added to the user
        const timeEvent = new Date("01-01-2024");
        const dataUser = {
          email,
          username: name,
          refId,
          role: Roles.USER,
          avatarUrl: picture,
          balanceSys: new Date().getTime() < timeEvent.getTime() ? 1.3307 : 0,
          eventUser:
            new Date().getTime() < timeEvent.getTime()
              ? EventUser.FREE
              : EventUser.FEE,
        };
        user = await this.userService.save(dataUser as User);
      } else {
        user = checkUserExists;
      }

      const resultRefreshToken = await this.getOrCreateToken(
        user,
        Roles.USER,
        user.refId,
        tokenId.userAgent,
        tokenId.ip,
      );
      return {
        ...user,
        accessToken: resultRefreshToken.accessToken,
        expiredAt: resultRefreshToken.expiredAt,
        refreshToken: resultRefreshToken.refreshString,
      };
    } catch (error) {
      this.throwErrorProcessNoAuth(error);
    }
  }

  /**
   * @param renewToken
   * @returns
   */
  @Post("renew-token")
  async renewToken(
    @Body() renewToken: RenewTokenDto,
  ): Promise<Record<string, unknown>> {
    try {
      const refreshToken = await this.authService.findOne({
        where: {
          refreshString: renewToken.refreshToken,
          "user.id": renewToken.userId,
        },
        relations: ["user"],
      });

      const hourExpired = this.configService.get<number>("TOKEN_EXPIRED");

      if (!refreshToken) {
        throwValidate(
          this.i18n.lang("GENERATE_TOKEN_ERROR"),
          "Tạo mới Token  thất bại",
          ErrorCodes.GENERATE_TOKEN_ERROR,
        );
      } else {
        const time = Date.now();
        const token = await this.authService.generateToken({
          userId: refreshToken.user.id,
          refId: refreshToken.user.refId,
          role: refreshToken.user.role,
        });
        // userTypeId:2 for Refresh Token
        const hashRefToken: string = this.createNewHash(2);
        refreshToken.accessToken = token;
        refreshToken.expiredAt = time + hourExpired * 60 * 60 * 24 * 1000;
        refreshToken.refreshString = `${hashRefToken}-${time}`;
      }
      const resultRefreshToken = await this.authService.store(refreshToken);

      return {
        accessToken: resultRefreshToken.accessToken,
        expiredAt: resultRefreshToken.expiredAt,
        refreshToken: resultRefreshToken.refreshString,
      };
    } catch (error) {
      this.throwErrorProcessNoAuth(error);
    }
  }

  /**
   * Register user with phone number
   * @param registerUser
   * @returns
   */
  @Post("register")
  async registerWithPhone(@Body() registerUser: RegisterOrLoginUserDto) {
    try {
      const checkUserExist = await this.userService.findOne({
        where: {
          phoneNumber: registerUser.phoneNumber,
        },
      });

      if (checkUserExist) {
        throwValidate(
          this.i18n.lang("ACCOUNT_ALREADY_EXISTS"),
          "Tài khoản đã tồn tại",
          ErrorCodes.ACCOUNT_ALREADY_EXISTS,
        );
      }

      const password = md5(registerUser.password);
      const refId = this.createNewHash(1);

      // If the user registers in December, 1.44usd will be added to the user
      const timeEvent = new Date("01-01-2024");
      const dataUser = {
        phoneNumber: registerUser.phoneNumber,
        password,
        refId,
        role: Roles.USER,
        balanceSys: new Date().getTime() < timeEvent.getTime() ? 1.3307 : 0,
        eventUser:
          new Date().getTime() < timeEvent.getTime()
            ? EventUser.FREE
            : EventUser.FEE,
      };

      const user: User = await this.userService.save(dataUser as User);
      const resultRefreshToken = await this.getOrCreateToken(
        user,
        Roles.USER,
        user.refId,
        registerUser.userAgent,
        registerUser.ip,
      );
      return {
        ...user,
        accessToken: resultRefreshToken.accessToken,
        expiredAt: resultRefreshToken.expiredAt,
        refreshToken: resultRefreshToken.refreshString,
      };
    } catch (error) {
      this.throwErrorProcessNoAuth(error);
    }
  }

  @Post("login")
  async loginUser(@Body() loginUser: LoginUserDto) {
    try {
      const checkUserExist: User = await this.userService.findOne({
        where: {
          phoneNumber: loginUser.phoneNumber,
          password: md5(loginUser.password),
        },
      });

      if (!checkUserExist) {
        throwValidate(
          this.i18n.lang("ACCOUNT_OR_PASSWORD_IS_INCORRECT"),
          "Tài khoản hoặc mật khẩ ko chính xác",
          ErrorCodes.ACCOUNT_OR_PASSWORD_IS_INCORRECT,
        );
      }

      const resultRefreshToken = await this.getOrCreateToken(
        checkUserExist,
        Roles.USER,
        checkUserExist.refId,
        loginUser.userAgent,
        loginUser.ip,
      );
      return {
        ...checkUserExist,
        accessToken: resultRefreshToken.accessToken,
        expiredAt: resultRefreshToken.expiredAt,
        refreshToken: resultRefreshToken.refreshString,
      };
    } catch (error) {
      this.throwErrorProcessNoAuth(error);
    }
  }

  @Post("/admin/login")
  async loginAdmin(@Body() loginAdmin: LoginAdminDto) {
    try {
      const checkAdmin: User = await this.userService.findOne({
        where: {
          email: loginAdmin.email,
          password: md5(loginAdmin.password),
          role: Roles.ADMIN,
        },
      });

      if (!checkAdmin) {
        throwValidate(
          this.i18n.lang("ACCOUNT_OR_PASSWORD_IS_INCORRECT"),
          "Tài khoản hoặc mật khẩ ko chính xác",
          ErrorCodes.ACCOUNT_OR_PASSWORD_IS_INCORRECT,
        );
      }

      const resultRefreshToken: RefreshToken = await this.getOrCreateToken(
        checkAdmin,
        Roles.ADMIN,
        checkAdmin.refId,
      );
      return {
        message: "Login success",
        data: {
          ...checkAdmin,
          accessToken: resultRefreshToken.accessToken,
          expiredAt: resultRefreshToken.expiredAt,
          refreshToken: resultRefreshToken.refreshString,
        },
      };
    } catch (error) {
      this.throwErrorProcessNoAuth(error);
    }
  }

  /**
   *
   * @param userId
   * @param role
   * @param userCode
   * @param userAgent
   * @param ip
   * @returns
   */
  protected async getOrCreateToken(
    user: User,
    role: string,
    refId: string,
    userAgent?: string,
    ip?: string,
  ): Promise<RefreshToken> {
    let refreshToken = await this.authService.findOne({
      where: {
        "user.id": user.id,
      },
    });

    const time = Date.now();
    const token = await this.authService.generateToken({
      userId: user.id,
      refId,
      role,
    });
    const hourExpired = this.configService.get<number>("TOKEN_EXPIRED");

    if (!refreshToken) {
      const userTypeId = 1;
      const shard = 511;
      const sequenceId = Math.floor(Math.random() * 1024);
      const refId = generateId(userTypeId, Date.now(), shard, sequenceId);

      refreshToken = plainToClass(RefreshToken, {
        user,
        accessToken: token,
        expiredAt: time + hourExpired * 60 * 60 * 24 * 1000,
        refreshString: `${refId}-${time}`,
        userAgent: userAgent,
        ip: ip,
      });
    } else {
      refreshToken.userAgent = userAgent;
      refreshToken.ip = ip;
      refreshToken.accessToken = token;
      refreshToken.expiredAt = time + hourExpired * 60 * 60 * 1000 * 24;
    }

    const resultRefreshToken = await this.authService.store(refreshToken);
    return resultRefreshToken;
  }

  /**
   *
   * @param userId
   * @param userTypeId
   * @returns
   */
  protected createNewHash(userTypeId: number) {
    const shard = 511;
    const sequenceId = Math.floor(Math.random() * 1024);
    const refId = generateId(userTypeId, Date.now(), shard, sequenceId);
    return refId;
  }
}
