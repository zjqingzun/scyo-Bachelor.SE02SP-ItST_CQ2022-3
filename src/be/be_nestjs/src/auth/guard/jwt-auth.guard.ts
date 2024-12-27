
import { IS_PUBLIC_KEY } from '@/helpers/decorator/public';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector : Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
          if (isPublic) {
            return true;
          }
        return super.canActivate(context);
      }
    
    handleRequest(err: any, user: any, info: any) {
      if (!user) {
        if (info && info.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Access Token has expired');
        } else if (info && info.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid Access Token');
        } else {
          throw new UnauthorizedException('Access Token is missing or invalid');
        }
      }
      return user;
    }
}
