import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
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
    await this.userService.saveUser(user);
    return {
      statusCode: 201,
    };
  }
}
