import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ErrorCodes } from 'src/constants/error-code.const';
import { LoggerService } from 'src/logger/custom.logger';

@Catch(WsException, HttpException)
export class WsExceptionFilter {
  constructor(private logger: LoggerService) {}

  public catch(exception: HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    this.handleMessage(exception)
    this.handleError(client, exception);
  }

  public handleError(client: Socket, exception: HttpException | WsException) {
    let responseBody: unknown = { message: 'Internal server error' };
    if (exception instanceof HttpException) {
      responseBody = {
        message: 'Error connect socket',
        errorCode: ErrorCodes.SOCKET,
        cause: exception.message,
      };
    } else {
      // handle websocket exception
      responseBody = {
        message: 'Error socket',
        errorCode: ErrorCodes.SOCKET,
        cause: exception.message,
      };
    }
    client.emit('error', JSON.stringify(responseBody));
  }

  private handleMessage(
    exception: HttpException | WsException,
  ): void {
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      message = JSON.stringify(exception.getResponse());
    } else{
        message = JSON.stringify('Error socket');

    }

    this.logger.error(message);
  }
}
