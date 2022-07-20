import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { authorizationSchema } from '../../common/validation-schemas/authorization-input.schema';
import { registrationSchema } from '../../common/validation-schemas/registration-input.schema';
import { RoleType } from '../../constants';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { YupValidationPipe } from '../../pipes/yup-validation.pipe';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dtos/req/UserAuthDto';
import { UserRegisterDto } from './dtos/req/UserRegisterDto';
import { UserAuthResponseDto } from './dtos/res/UserAuthResponseDto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User authorization' })
  @ApiOkResponse({
    type: UserAuthResponseDto,
    description: 'Successfully Authorized',
  })
  login(
    @Body(new YupValidationPipe(authorizationSchema))
    userAuthDto: UserAuthDto,
  ): Promise<UserAuthResponseDto> {
    return this.authService.login(userAuthDto);
  }

  @Post('registration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User registration' })
  @ApiOkResponse({
    type: UserAuthResponseDto,
    description: 'Successfully Registered',
  })
  // @ApiFile({ name: 'avatar' })
  registration(
    @Body(new YupValidationPipe(registrationSchema))
    userRegisterDto: UserRegisterDto,
    // @UploadedFile() file: IFile,
  ): Promise<UserAuthResponseDto> {
    return this.authService.registration(userRegisterDto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User info' })
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }
}
