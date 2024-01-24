import { Response, Request } from "express";
import { FastifyRequest } from "fastify";

import { AuthService } from "src/modules/auth/auth.service";

import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(
    req: FastifyRequest,
    res: Response,
    next: (error?: Error) => void,
  ): Promise<void> {
    try {
      let token = req.headers.authorization;
      if (token) {
        token = token.replace("Bearer ", "");
        const jwtInfo = await this.authService.verifyToken(token);

        req.headers["userId"] = jwtInfo["userId"] || "";
        req.headers["refId"] = jwtInfo["refId"] || "";
        req.headers["role"] = jwtInfo["role"] || "";
        req.headers["lang"] = req.headers["lang"] || "en";
      } else {
        req.headers["userId"] = "a";
        req.headers["refId"] = "a";
        req.headers["role"] = "admin";
        req.headers["lang"] = req.headers["lang"] || "en";
      }

      next();
    } catch (error) {
      console.log("error parse token", error);
      next(error);
    }
  }
}
