import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';

import type { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import type { UserRegisterDto } from './dtos/req/UserRegisterDto';
import type { TokenResponseDto } from './dtos/res/TokenResponseDto';
import type { IAuthPayload } from './types/types/AuthPayloadInterface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registration(
    userRegisterDto: UserRegisterDto,
  ): Promise<TokenResponseDto> {
    const candidate = await this.userService.getUserByEmail(
      userRegisterDto.email,
    );

    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await hash(userRegisterDto.password, 5);

    const user = await this.userService.createUser({
      ...userRegisterDto,
      password: hashPassword,
    });

    // TODO: add mail verification
    return this.generateToken(user);
  }

  private generateToken(user: UserEntity): TokenResponseDto {
    const payload: IAuthPayload = {
      email: user.email,
      id: user.id,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
