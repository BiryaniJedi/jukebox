import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from '../database/database.service';
import { assertFound } from '../common/db-utils';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async addUser(dto: CreateUserDto): Promise<User> {
    const result = await this.db.query<User>(
      `INSERT INTO users (display_name)
       VALUES ($1)
       RETURNING user_id, display_name, created_at`,
      [dto.displayName],
    );

    const user = result.rows[0];

    return user;
  }

  async getUser(id: string): Promise<User> {
    const result = await this.db.query<User>(
      `SELECT user_id, display_name, created_at
       FROM users
       WHERE user_id = $1`,
      [id],
    );

    return assertFound(result.rows, id, 'User');
  }

  async getUsers(): Promise<User[]> {
    const result = await this.db.query<User>(
      `SELECT user_id, display_name, created_at
       FROM users
       ORDER BY created_at DESC`,
    );

    return result.rows;
  }

  async deleteUser(id: string): Promise<User> {
    const result = await this.db.query<User>(
      `DELETE FROM users
       WHERE user_id = $1
       RETURNING user_id, display_name, created_at`,
      [id],
    );

    return assertFound(result.rows, id, 'User');
  }
}
