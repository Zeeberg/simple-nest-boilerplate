import { Repository } from 'typeorm';

import { CustomRepository } from '../../database/typeorm-ex.decorator';
import type { GetUsersFilter } from './types/get-users.filter';
import { UserEntity } from './user.entity';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async getUsers(filter: GetUsersFilter): Promise<UserEntity[]> {
    const { skip, take, orderBy, orderDir } = filter;
    const query = this.createQueryBuilder('user')
      .orderBy(`user.${orderBy}`, orderDir)
      .take(take)
      .skip(skip);

    const res = await query.getMany();

    return res;
  }
}
