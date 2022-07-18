import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserService } from '../user/user.service';
import type { IAuthPayload } from './types/types/AuthPayloadInterface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ApiConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.authConfig.jwtSecret || 'SECRET',
    });
  }

  async validate(payload: IAuthPayload) {
    const user = await this.userService.findOne({
      id: payload.id,
      role: payload.role,
    });

    if (!user) {
      throw new UnauthorizedException('auth.unauthorized');
    }

    return user;
  }
}
