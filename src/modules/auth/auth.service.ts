import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';

import type { Optional } from '../../types';
import type { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import type { UserAuthDto } from './dtos/req/user-auth.dto';
import type { UserRegisterDto } from './dtos/req/user-register.dto';
import type { TokenResponseDto } from './dtos/res/token-response.dto';
import { UserAuthResponseDto } from './dtos/res/user-auth-response.dto';
import type { IAuthPayload } from './types/types/AuthPayloadInterface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userAuthDto: UserAuthDto): Promise<UserAuthResponseDto> {
    const userEntity = await this.validateUser(userAuthDto);

    const token = this.generateToken(userEntity);

    return new UserAuthResponseDto(userEntity.toDto(), token);
  }

  async validateUser(userAuthDto: UserAuthDto): Promise<UserEntity> {
    const user = await this.userService.getUserByEmail(userAuthDto.email);

    if (!user) {
      throw new NotFoundException('auth.userNotFound');
    }

    const passwordEquals = await compare(
      String(userAuthDto.password),
      user.password,
    );

    if (!passwordEquals) {
      throw new UnauthorizedException('auth.wrongPasswordOrEmail');
    }

    return user;
  }

  async registration(
    userRegisterDto: UserRegisterDto,
  ): Promise<UserAuthResponseDto> {
    const candidate = await this.userService.getUserByEmail(
      userRegisterDto.email,
    );

    if (candidate) {
      throw new HttpException('auth.userExists', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await hash(userRegisterDto.password, 5);

    const user = await this.userService.createUser({
      ...userRegisterDto,
      password: hashPassword,
    });

    // TODO: add mail verification
    return new UserAuthResponseDto(user.toDto(), this.generateToken(user));
  }

  generateToken(user: Optional<UserEntity>): TokenResponseDto {
    if (!user) {
      throw new NotFoundException('auth.userNotFound');
    }

    const payload: IAuthPayload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
