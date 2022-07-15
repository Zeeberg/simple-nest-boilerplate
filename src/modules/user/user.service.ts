import { Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';

import type { Nullable } from '../../types';
import type { UserRegisterDto } from '../auth/dtos/req/UserRegisterDto';
import type { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = this.userRepository.create(userRegisterDto);
    await this.userRepository.save(user);

    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async findOne(
    findData: FindOneOptions<UserEntity>,
  ): Promise<Nullable<UserEntity>> {
    const user = await this.userRepository.findOne(findData);

    return user;
  }
}
