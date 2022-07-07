import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface IAbstractEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AbstractEntity extends BaseEntity implements IAbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
