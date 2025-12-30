import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('Reached Auth Guard!');
    const req = context.switchToHttp().getRequest<Request>();
    const userId = req.headers['x-user-id'];
    if (typeof userId !== 'string') {
      throw new UnauthorizedException('Missing credentials');
    }
    const user = await this.authService.authenticate(userId);
    req.user = user!;
    console.log('AuthGuardSuccess! User Exists!');
    return true;
  }
}
