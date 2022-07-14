import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.authConfig.jwtSecret || 'SECRET',
        signOptions: {
          expiresIn: configService.authConfig.jwtExpiresIn || '24h',
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
