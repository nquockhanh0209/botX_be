import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { NotiService } from "./noti.service";
import { AuthService } from "../auth/auth.service";
import { GlobalSocket } from "./variable-noti";
import { WsExceptionFilter } from "src/filter/socket.filter";

@WebSocketGateway({ cors: true })
export class NotiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(NotiGateway.name);

  @WebSocketServer() wss: Server;

  constructor(
    private readonly notiService: NotiService,
    private readonly authService: AuthService,
  ) {}

  @UsePipes(new ValidationPipe())
  @UseFilters(WsExceptionFilter)
  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const userId: number = await this.authService.getUserFromSocket(socket);
      const countNotiNotSeen = await this.notiService.getCountNofiNotSeen(
        userId,
      );
      socket.emit("numberNotiNotSeen", JSON.stringify(countNotiNotSeen));

      // add socket user
      GlobalSocket[userId] = socket;

      return true;
    } catch (error) {
      socket.emit(
        "error",
        JSON.stringify({ message: `Error socket: ${error.message}` }),
      );
      //   throw new Error(error.message);
      this.logger.error(error.message);
    }
  }

  async handleDisconnect(client: any) {
    // remove socket user
    for (let obj in GlobalSocket) {
      if (GlobalSocket[obj].id == client.id) {
        delete GlobalSocket[obj];
        return;
      }
    }
  }
}
