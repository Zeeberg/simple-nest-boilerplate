import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class UserAuthDto {
  @ApiProperty()
  @IsDefined()
  readonly email: string;

  @ApiProperty()
  @IsDefined()
  readonly password: string;
}
