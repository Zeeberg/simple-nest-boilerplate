import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { Constructor } from '../types';
import type { AbstractDto } from './dto/abstract.dto';

export interface IAbstractEntity<DTO extends AbstractDto> {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  toDto(): DTO;
}

export class AbstractEntity<DTO extends AbstractDto = AbstractDto>
  extends BaseEntity
  implements IAbstractEntity<DTO>
{
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

  private dtoClass: Constructor<DTO, [AbstractEntity]>;

  toDto(): DTO {
    const dtoClass = this.dtoClass;

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      );
    }

    return new this.dtoClass(this);
  }
}
