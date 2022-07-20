import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UploadType } from '../../../common/types/upload-types.enum';
import type { UploadEntity } from '../upload.entity';

export class UploadDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty({ enum: UploadType, enumName: 'UploadType' })
  type: UploadType;

  @ApiProperty()
  used: boolean;

  constructor(file: UploadEntity) {
    super(file);
    this.name = file.fileName;
    this.mimeType = file.mimeType;
    this.type = file.type;
    this.used = file.used;
  }
}
