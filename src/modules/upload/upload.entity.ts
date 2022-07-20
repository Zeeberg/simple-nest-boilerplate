import { Column, Entity } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UploadType } from '../../common/types/upload-types.enum';
import { UseDto } from '../../decorators/use-dto.decorator';
import { UploadDto } from './dtos/upload.dto';

export interface IUploadEntity extends IAbstractEntity<UploadDto> {
  fileName: string;

  mimeType: string;

  type: UploadType;

  used: boolean;
}

@Entity({ name: 'uploads' })
@UseDto(UploadDto)
export class UploadEntity
  extends AbstractEntity<UploadDto>
  implements IUploadEntity
{
  @Column()
  fileName: string;

  @Column()
  mimeType: string;

  @Column({ nullable: false, default: UploadType.COMMON })
  type: UploadType;

  @Column({ nullable: false, default: false })
  used: boolean;
}
