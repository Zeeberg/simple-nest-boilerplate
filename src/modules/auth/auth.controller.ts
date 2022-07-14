import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { userInfoSchema } from '../../common/validation-schemas/registration-input.schema';
import { YupValidationPipe } from '../../pipes/yup-validation.pipe';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dtos/req/UserRegisterDto';
import { TokenResponseDto } from './dtos/res/TokenResponseDto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User registration' })
  @ApiOkResponse({
    type: TokenResponseDto,
    description: 'Successfully Registered',
  })
  // @ApiFile({ name: 'avatar' })
  registration(
    @Body(new YupValidationPipe(userInfoSchema))
    userRegisterDto: UserRegisterDto,
    // @UploadedFile() file: IFile,
  ): Promise<TokenResponseDto> {
    return this.authService.registration(userRegisterDto);
  }
}
