import { TokenDto } from "src/dtos/token.dto";

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const userMiddleware = request.headers as unknown as Record<
      string,
      unknown
    >;
    return new TokenDto({
      userId: userMiddleware["userId"]
        ? parseInt(userMiddleware["userId"] as string)
        : 0,
      role: userMiddleware["role"] ?? "",
      refId: userMiddleware["refId"] || "",
      lang: userMiddleware["lang"] || "en",
    });
  },
);
