import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.userRepository = userRepository;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async saveUser(user: User) {
    await this.userRepository.save(user);
  }
}
