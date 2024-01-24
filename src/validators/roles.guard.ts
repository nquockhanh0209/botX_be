import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const roles = this.reflector.get<string[]>("roles", context.getHandler());

    if (!request.headers) {
      return true;
    }
    const role = request.headers["role"]
      ? (request.headers["role"] as string)
      : null;
    const userId = request?.headers["userId"]
      ? (request.headers["userId"] as number)
      : null;
    const refId = request?.headers["refId"]
      ? (request.headers["refId"] as string)
      : null;
    if (roles) {
      if (!userId || !roles.includes(role) || !refId) {
        return false;
      }
      return true;
    }
    return true;
  }
}
