import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { LoggerService } from './logger/logger.service';
import {
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/client';

type ExceptionResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new LoggerService(AllExceptionsFilter.name);

  private getUniqueFields(exception: PrismaClientKnownRequestError): string[] {
    const meta = exception.meta;

    if (!meta || typeof meta !== 'object') {
      return [];
    }

    // Case 1: Official Prisma structure (meta.target)
    if ('target' in meta && Array.isArray(meta.target)) {
      return meta.target as string[];
    }

    // Case 2: Driver adapter nested structure
    if (
      'driverAdapterError' in meta &&
      typeof meta.driverAdapterError === 'object' &&
      meta.driverAdapterError !== null &&
      'cause' in meta.driverAdapterError &&
      typeof meta.driverAdapterError.cause === 'object' &&
      meta.driverAdapterError.cause !== null &&
      'constraint' in meta.driverAdapterError.cause &&
      typeof meta.driverAdapterError.cause.constraint === 'object' &&
      meta.driverAdapterError.cause.constraint !== null &&
      'fields' in meta.driverAdapterError.cause.constraint &&
      Array.isArray(meta.driverAdapterError.cause.constraint.fields)
    ) {
      return meta.driverAdapterError.cause.constraint.fields as string[];
    }

    return [];
  }

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseObject: ExceptionResponse = {
      statusCode: 200,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      responseObject.statusCode = exception.getStatus();
      responseObject.response = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      responseObject.statusCode = 422;
      responseObject.response = exception.message.replaceAll(/\n/g, ' ');
    } else if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        responseObject.statusCode = HttpStatus.CONFLICT;
        responseObject.response = {
          message: 'Account Exist',
          fields: this.getUniqueFields(exception),
        };
      } else {
        responseObject.statusCode = HttpStatus.BAD_REQUEST;
        responseObject.response = exception.message;
      }
    } else {
      responseObject.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseObject.response = 'Internal Server Error';
    }

    response.status(responseObject.statusCode).json(responseObject);
    this.logger.error(responseObject.response, AllExceptionsFilter.name);

    super.catch(exception, host);
  }
}
