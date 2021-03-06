import { Column, Entity, OneToOne } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../constants';
import { UseDto } from '../../decorators/use-dto.decorator';
import { UserDto } from './dtos/user.dto';
import type { IUserSettingsEntity } from './user-settings.entity';
import { UserSettingsEntity } from './user-settings.entity';

export interface IUserEntity extends IAbstractEntity<UserDto> {
  firstName?: string;

  lastName?: string;

  role: RoleType;

  email?: string;

  password?: string;

  phone?: string;

  avatar?: string;

  fullName?: string;

  settings?: IUserSettingsEntity;
}

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> implements IUserEntity {
  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;
}
