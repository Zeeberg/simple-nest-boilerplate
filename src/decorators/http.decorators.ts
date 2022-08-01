import type { PipeTransform, Type } from '@nestjs/common';
import {
  applyDecorators,
  Param,
  ParseUUIDPipe,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import type { RoleType } from '../constants';
import { RoleTypeSwagger } from '../constants/role-type-swagger';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(
  roles: RoleType[] = [],
  summary?: string,
): MethodDecorator {
  const additionSummaryRoles = roles
    .map((role) => RoleTypeSwagger[role])
    .join(' | ');

  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard(), RolesGuard),
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: `${summary} 🔒 Roles: ${additionSummaryRoles}`,
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
