import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // 201
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    const result = await this.usersService.addUser(dto);
    return result;
  }

  @Get(':user_id')
  async getUserById(@Param('user_id') user_id: string): Promise<User> {
    const result = await this.usersService.getUser(user_id);
    return result;
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    const result = await this.usersService.getUsers();
    return result;
  }

  @Delete(':user_id')
  async deleteUserById(@Param('user_id') user_id: string): Promise<User> {
    const result = await this.usersService.deleteUser(user_id);
    return result;
  }
}
