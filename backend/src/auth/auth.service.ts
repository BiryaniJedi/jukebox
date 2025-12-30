import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.model';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async authenticate(
    userId: string,
  ): Promise<{ user_id: string; display_name: string } | null> {
    if (!userId) {
      throw new UnauthorizedException(
        'Missing credentials: user_id cannot be empty.',
      );
    }

    const user: User = await this.usersService.getUser(userId);
    return {
      user_id: user.user_id,
      display_name: user.display_name,
    };
  }
}
