import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";
import { OAuth2Client } from "google-auth-library";
import RedisComponent from "src/components/redis.component";
import { MessageComponent } from "src/components/message.component";
import { User } from "src/entities/User";
import { RefreshToken } from "src/entities/RefreshToken";

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          privateKey: configService.get("privateKey"),
          publicKey: configService.get("publicKey"),
          signOptions: {
            expiresIn: `${configService.get<number>("TOKEN_EXPIRED")}d`,
            issuer: "x.site",
            audience: "x.site",
            algorithm: "RS256",
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, UserService, RedisComponent,MessageComponent],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
