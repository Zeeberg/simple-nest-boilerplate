import { ApiProperty } from '@nestjs/swagger';

import { UploadDto } from '../upload.dto';

export class UploadFileResponseDto {
  @ApiProperty({ type: UploadDto })
  file: UploadDto;

  @ApiProperty()
  url: string;

  constructor(file: UploadDto, url: string) {
    this.file = file;
    this.url = url;
  }
}
