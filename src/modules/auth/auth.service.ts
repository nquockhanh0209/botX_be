import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import { Auth, google } from "googleapis";
import { BaseService } from "src/base/base.service";
import { ErrorCodes } from "src/constants/error-code.const";
import { RefreshToken } from "src/entities/RefreshToken";
import { ValidateError } from "src/exceptions/errors/validate.error";
import * as jwt from "jsonwebtoken";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Socket } from "socket.io";

@Injectable()
export class AuthService extends BaseService<RefreshToken> {
  constructor(
    private jwtService: JwtService,

    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,

    private readonly configService: ConfigService,
  ) {
    super(refreshTokenRepository);
  }

  /**
   *
   * @param tokenId
   * @returns
   */
  async loginGoogleUser(tokenId: string) {
    try {
      const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID); // create new auth client
      oauth2Client.setCredentials({ access_token: tokenId }); // use the new auth client with the access_token
      let oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
      });

      let { data } = await oauth2.userinfo.get();
      const { email, name, picture } = data;
      return { email, name, picture };
    } catch (error) {
      throw new ValidateError(
        "VALIDATE_ID_TOKEN_ERROR",
        error as unknown as Record<string, unknown>,
        ErrorCodes.GENERATE_TOKEN_ERROR,
      );
    }
  }

  async generateToken(
    payload: Record<string, unknown>,
    signOptions: jwt.SignOptions = {},
  ): Promise<string> {
    return this.jwtService.sign(payload, signOptions);
  }

  async decodeToken(
    token: string,
    decodeOptions: jwt.DecodeOptions = {},
  ): Promise<null | string | { [key: string]: unknown }> {
    return this.jwtService.decode(token, decodeOptions);
  }

  async verifyToken(
    token: string,
    verifyOptions: JwtVerifyOptions = {},
  ): Promise<null | string | { [key: string]: any }> {
    return this.jwtService.verifyAsync(token, verifyOptions);
  }

  store(data: RefreshToken): Promise<RefreshToken> {
    return this.refreshTokenRepository.save(data);
  }

  async getUserFromSocket(socket: Socket) {
    const token: string | string[] = socket.handshake.query["token"];
    // socket.send("error",JSON.stringify({error:"JWT expried"}))
    const jwtInfo = await this.verifyToken(token as string);
    return jwtInfo["userId"];
  }
}
