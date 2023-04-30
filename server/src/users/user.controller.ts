import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return {
      data: users,
    };
  }

  @Post()
  async saveUser(@Body() user: User) {
    try {
      await this.userService.saveUser(user);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new HttpException('Already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      statusCode: 201,
    };
  }
}
