import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

export const GetCurrentUserId = createParamDecorator(
  (_data, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    return user && user['sub'];
  },
);

export const GetCurrentUserRefreshToken = createParamDecorator(
  (_data, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    return user && user['refreshToken'];
  },
);
