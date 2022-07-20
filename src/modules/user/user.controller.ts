import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { getUsersSchema } from '../../common/validation-schemas/get-users-input.schema';
import { RoleType } from '../../constants';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { YupValidationPipe } from '../../pipes/yup-validation.pipe';
import type { Nullable } from '../../types';
import { UserDto } from './dtos/user.dto';
import { GetUsersFilter } from './types/get-users.filter';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'Users info' })
  getUsers(
    @Query(new YupValidationPipe(getUsersSchema)) filter: GetUsersFilter,
  ): Promise<Nullable<UserDto[]>> {
    return this.userService.getUsers(filter);
  }

  @Get(':id')
  @Auth([RoleType.USER, RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user info by id' })
  @ApiOkResponse({ description: 'User info', type: UserDto })
  getUserById(@UUIDParam('id') userId: string): Promise<UserDto> {
    return this.userService.getUserById(userId);
  }
}
