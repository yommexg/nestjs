import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ProfilesGuard implements CanActivate {
  canActivate() // context: ExecutionContext,
  : boolean | Promise<boolean> | Observable<boolean> {
    // const request: Request = context.switchToHttp().getRequest();

    return true;
  }
}
