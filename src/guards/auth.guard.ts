/* istanbul ignore file */

import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  /* istanbul ignore next */
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request.session.userId;
  }
}
