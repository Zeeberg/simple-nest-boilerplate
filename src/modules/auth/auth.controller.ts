import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { authorizationSchema } from '../../common/validation-schemas/authorization-input.schema';
import { registrationSchema } from '../../common/validation-schemas/registration-input.schema';
import { YupValidationPipe } from '../../pipes/yup-validation.pipe';
import { AuthService } from './auth.service';
import { UserAuthDto } from './dtos/req/UserAuthDto';
import { UserRegisterDto } from './dtos/req/UserRegisterDto';
import { UserAuthResponseDto } from './dtos/res/UserAuthResponseDto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User authorization' })
  @ApiOkResponse({
    type: UserAuthResponseDto,
    description: 'Successfully Authorized',
  })
  async login(
    @Body(new YupValidationPipe(authorizationSchema))
    userAuthDto: UserAuthDto,
  ): Promise<UserAuthResponseDto> {
    const userEntity = await this.authService.validateUser(userAuthDto);

    const token = this.authService.generateToken(userEntity);

    return new UserAuthResponseDto(userEntity.toDto(), token);
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
}
