import { Repository } from 'typeorm';

import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { UserEntity } from './user.entity';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
