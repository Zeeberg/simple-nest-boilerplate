import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty()
  @IsDefined()
  readonly firstName: string;

  @ApiProperty()
  @IsDefined()
  readonly lastName: string;

  @ApiProperty()
  @IsDefined()
  readonly email: string;

  @ApiProperty()
  @IsDefined()
  readonly password: string;
}
