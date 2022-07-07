import { Column, Entity } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';

export interface IUserEntity extends IAbstractEntity {
  firstName?: string;

  lastName?: string;
}

@Entity('users')
export class UserEntity extends AbstractEntity implements IUserEntity {
  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;
}
