import { DatabaseError } from "src/exceptions/errors/database.error";
import {
  InvalidExpressionError,
} from "src/exceptions/errors/invalid-expression.error";
import { InvalidValueError } from "src/exceptions/errors/invalid-value.error";
import { NotFoundError } from "src/exceptions/errors/not-found.error";
import { ServiceCallError } from "src/exceptions/errors/service.call.error";
import { ValidateError } from "src/exceptions/errors/validate.error";

import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  InternalServerErrorException,
  MethodNotAllowedException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnsupportedMediaTypeException,
} from "@nestjs/common";

// Expression error
export const throwValidate = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new ValidateError(
        error,
        cause,
        errorCode
    )
}

export const throwNotFound = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new NotFoundError(
        error,
        cause,
        errorCode
    )
}

export const throwDatabase = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new DatabaseError(
        error,
        cause,
        errorCode
    )
}

export const throwInvalidExpression = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new InvalidExpressionError(
        error,
        cause,
        errorCode
    )
}

export const throwInvalidValueError = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new InvalidValueError(
        error,
        cause,
        errorCode
    )
}

export const throwServiceCallError = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new ServiceCallError(
        error,
        cause,
        errorCode
    )
}

// HttpException error
// 400
export const throwBadRequest = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new BadRequestException({
        message: error,
        cause: cause,
        errorCode: errorCode
    })
}

// 502
export const throwBadGateway = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new BadGatewayException({
        message: error,
        cause: cause,
        errorCode: errorCode
    })
}

// 409
export const throwConflict = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new ConflictException({
        message: error,
        cause: cause,
        errorCode: errorCode
    })
}

// 403
export const throwForbidden = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new ForbiddenException({
        message: error,
        cause: cause,
        errorCode: errorCode
    })
}

// 504
export const throwGatewayTimeout = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new GatewayTimeoutException({
        message: error,
        cause: cause,
        errorCode: errorCode
    })
}

// 500
export const throwInternalServerError = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new InternalServerErrorException({
        message: error,
        cause: cause,
        errorCode: errorCode
    })
}

// 405
export const throwMethodNotAllowed = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new MethodNotAllowedException({
        message: error,
        cause: cause,
        errorCode: errorCode
    })
}

// 408
export const throwRequestTimeout = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new RequestTimeoutException({
        message: error,
        cause: cause,
        errorCode: errorCode
    })
}

// 503
export const throwServiceUnavailable = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new ServiceUnavailableException({
        message: error,
        cause: cause,
        errorCode: errorCode
    })
}

// 401
export const throwUnauthorized = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new UnauthorizedException({
        message: error,
        cause: cause,
        errorCode: errorCode
    })
}

// 415
export const UnsupportedMediaType = (error: string, cause: string | Record<string, unknown>, errorCode: number) => {
    throw new UnsupportedMediaTypeException({
        message: error,
        cause: cause,
        errorCode: errorCode
    })
}