import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from 'src/decorator/role.decorator';

@Injectable()
export class UserRoleGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    await (super.canActivate(context) as Promise<boolean>);
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride<string>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (request?.user) {
      return requiredRoles
        ? requiredRoles === request.user.role
        : request.user.role === 'user' || request.user.role === 'admin';
    }
    return false;
  }
}
