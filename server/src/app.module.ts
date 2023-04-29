import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { UserController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'test_user',
      password: '1234',
      database: 'test_db',
      entities: [User],
      synchronize: true,
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UsersService],
})
export class AppModule {}
