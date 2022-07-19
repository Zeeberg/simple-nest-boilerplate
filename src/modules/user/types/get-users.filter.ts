import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { orderDir, orderFields } from '../../../constants';

export class GetUsersFilter {
  @ApiPropertyOptional({
    default: 20,
    minimum: 1,
    maximum: 1000,
    description: 'Number of users to take',
  })
  @IsOptional()
  @Transform(({ value }) => value && Number.parseInt(value as string, 10))
  readonly take?: number = 20;

  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
    description: 'Number of users to skip',
  })
  @IsOptional()
  @Transform(({ value }) => value && Number.parseInt(value as string, 10))
  readonly skip?: number = 0;

  @ApiPropertyOptional({
    enum: orderFields,
    default: 'id',
    description: 'Field to sort',
  })
  @IsOptional()
  readonly orderBy?: string = 'id';

  @ApiPropertyOptional({
    enum: orderDir,
    default: 'ASC',
    description: 'Order direction',
  })
  @IsOptional()
  readonly orderDir?: 'ASC' | 'DESC' = 'ASC';
}
