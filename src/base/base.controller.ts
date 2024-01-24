import { MessageComponent } from "src/components/message.component";
import { ErrorCodes } from "src/constants/error-code.const";
import { TokenDto } from "src/dtos/token.dto";
import { BaseError } from "src/exceptions/errors/base.error";
import { DatabaseError } from "src/exceptions/errors/database.error";
import { throwDatabase, throwValidate } from "src/utils/throw-exception.util";
import { QueryFailedError } from "typeorm";

import { BadRequestException } from "@nestjs/common";

export class BaseController {
  private l: MessageComponent;

  constructor(i18n: MessageComponent) {
    this.l = i18n;
  }

  protected throwErrorProcess(error: any, token: TokenDto) {
    console.log("Debug", error);
    if (error instanceof BaseError) {
      throw new BadRequestException({
        message: this.l.lang(error.getMessage(), token.lang),
        cause: error.getCause(),
        errorCode: error.getErrorCode(),
      });
    } else if (error instanceof TypeError) {
      throw throwValidate(
        this.l.lang("UNKNOWN_ERROR", token.lang),
        { errorContent: { message: error.message, stack: error.stack } },
        ErrorCodes.SYNTAXERROR,
      );
    } else if (error instanceof QueryFailedError) {
      throwDatabase(
        this.l.lang("UNKNOWN_ERROR", token.lang),
        JSON.stringify(error),
        ErrorCodes.UNKNOWN,
      );
    }

    throw new DatabaseError(
      this.l.lang("UNKNOWN_ERROR", token.lang),
      { errorContent: error },
      ErrorCodes.UNKNOWN,
    );
  }

  protected throwErrorProcessNoAuth(error: any) {
    console.log("Debug", error);
    if (error instanceof BaseError) {
      throw new BadRequestException({
        message: this.l.lang(error.getMessage()),
        cause: error.getCause(),
        errorCode: error.getErrorCode(),
      });
    } else if (error instanceof TypeError) {
      throw throwValidate(
        this.l.lang("UNKNOWN_ERROR"),
        { errorContent: { message: error.message, stack: error.stack } },
        ErrorCodes.SYNTAXERROR,
      );
    } else if (error instanceof QueryFailedError) {
      throwDatabase(
        this.l.lang("UNKNOWN_ERROR"),
        JSON.stringify(error),
        ErrorCodes.UNKNOWN,
      );
    }

    throw new DatabaseError(
      this.l.lang("UNKNOWN_ERROR"),
      { errorContent: error },
      ErrorCodes.UNKNOWN,
    );
  }

  protected throwSuccessProcess(message: string) {
    return { message };
  }
}
