import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import type { IUserEntity } from './user.entity';
import { UserEntity } from './user.entity';

export interface IUserSettingsEntity extends IAbstractEntity {
  isEmailVerified?: boolean;

  isPhoneVerified?: boolean;

  user?: IUserEntity;
}

@Entity({ name: 'user_settings' })
export class UserSettingsEntity
  extends AbstractEntity
  implements IUserSettingsEntity
{
  @Column({ default: false })
  isEmailVerified?: boolean;

  @Column({ default: false })
  isPhoneVerified?: boolean;

  @Column({ type: 'uuid' })
  userId?: string;

  @OneToOne(() => UserEntity, (user) => user.settings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
