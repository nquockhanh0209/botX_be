import Request from "fastify";

import {
  Controller,
  Get,
  Req,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  Post,
  BadRequestException,
  UploadedFile,
  Body,
  Res,
  StreamableFile,
} from "@nestjs/common";

import { AppService } from "./app.service";
import { BaseError } from "./exceptions/errors/base.error";
import { DatabaseError } from "./exceptions/errors/database.error";
import { ValidateError } from "./exceptions/errors/validate.error";
import {
  bitCount,
  editFileName,
  fileMapper,
  imageFileFilter,
  startTimeOfDay,
} from "./utils/general.util";
import { RolesGuard } from "./validators/roles.guard";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { FastifyFileInterceptor } from "./validators/localFiles.interceptor";
import { Token } from "./decorators/token.decorator";
import { TokenDto } from "./dtos/token.dto";
import { Express } from "express";
import { ConfigService } from "@nestjs/config";
import { PathSaveImg } from "./constants/path-save-img.const";
import { BaseController } from "./base/base.controller";
import { MessageComponent } from "./components/message.component";
import { throwBadRequest } from "./utils/throw-exception.util";
import { ErrorCodes } from "./constants/error-code.const";
import { diskStorage } from "multer";
import { SingleFileDto } from "./dtos/upload-file";
import type { Response } from "express";
import { createReadStream, writeFile } from "fs";
import { join } from "path";
import { CsvService } from "./modules/csv/csv.service";

@Controller()
@UseGuards(RolesGuard)
export class AppController extends BaseController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private i18n: MessageComponent,
    private readonly csvService: CsvService,
  ) {
    super(i18n);
  }

  @Get("profile")
  async getHello(@Req() request: Request): Promise<string> {
    console.log(startTimeOfDay());
    console.log(startTimeOfDay(false));

    return JSON.stringify([this.appService.getHello(), request.headers]);
  }

  @Get("exceptions")
  async TestException(@Req() request: Request): Promise<string> {
    try {
      throw new ValidateError("validate", "fdf", 400);
      // throwError<ValidateError>("database", "fdf", 400)
    } catch (e) {
      if (e instanceof ValidateError) {
        console.log("ValidateError", e);
      } else if (e instanceof DatabaseError) {
        console.log("DatabaseError", e);
      } else if (e instanceof BaseError) {
        console.log("BaseError", e);
      }
    }

    return "test";
  }

  @Get("healthz")
  selfCheck(): unknown {
    return { message: "Request Succeed!" };
  }

  @Post("avatar")
  //   @SetMetadata("roles", ["User", "Admin"])
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FastifyFileInterceptor("photo_url", {
      storage: diskStorage({
        destination: `./${PathSaveImg.PATH_IMG_AVATAR}`,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: Math.pow(1024, 10), // 10MB
      },
    }),
  )
  async addAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: SingleFileDto,
  ) {
    const result = fileMapper({ file, req });
    return result;
  }

}
