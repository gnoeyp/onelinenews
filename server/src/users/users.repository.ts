import { User } from '../entities/user.entity';
import { DataSource } from 'typeorm';

export const userRepostiory = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
