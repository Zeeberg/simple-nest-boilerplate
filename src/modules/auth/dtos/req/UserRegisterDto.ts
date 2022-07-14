import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty()
  @IsDefined()
  readonly first_name: string;

  @ApiProperty()
  @IsDefined()
  readonly last_name: string;

  @ApiProperty()
  @IsDefined()
  readonly email: string;

  @ApiProperty()
  @IsDefined()
  readonly password: string;
}
