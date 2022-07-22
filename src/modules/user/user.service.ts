import { Injectable, NotFoundException } from '@nestjs/common';
import type { FindOptionsWhere } from 'typeorm';

import type { Nullable } from '../../types';
import type { UserRegisterDto } from '../auth/dtos/req/user-register.dto';
import type { UserDto } from './dtos/user.dto';
import type { GetUsersFilter } from './types/get-users.filter';
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

  async getUserById(userId: string): Promise<UserDto> {
    const user = await this.findOne({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('user.NotFound');
    }

    return user?.toDto();
  }

  async findOne(
    findData:
      | FindOptionsWhere<UserEntity>
      | Array<FindOptionsWhere<UserEntity>>,
  ): Promise<Nullable<UserEntity>> {
    const user = await this.userRepository.findOneBy(findData);

    return user;
  }

  async getUsers(filter: GetUsersFilter): Promise<Nullable<UserDto[]>> {
    const users = await this.userRepository.getUsers(filter);

    return users.map((user) => user.toDto());
  }
}
