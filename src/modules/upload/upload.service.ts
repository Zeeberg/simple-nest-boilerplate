import { Injectable, NotFoundException } from '@nestjs/common';
import type { FindOptionsWhere } from 'typeorm';

import { ApiConfigService } from '../../shared/services/api-config.service';
import type { Nullable } from '../../types';
import { UploadFileResponseDto } from './dtos/res/UploadFileResponseDto';
import type { UploadEntity } from './upload.entity';
import { UploadRepository } from './upload.repository';

@Injectable()
export class UploadService {
  constructor(
    private uploadRepository: UploadRepository,
    private readonly configService: ApiConfigService,
  ) {}

  async getUploadedFileInfo(
    file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    const foundFile = await this.findOne({
      fileName: file.filename,
    });

    if (!foundFile) {
      throw new NotFoundException('upload.fileNotFound');
    }

    const url = `${
      this.configService.serverUrl
    }${this.configService.uploadConfig.uploadDirectory.slice(2)}/${
      foundFile.fileName
    }`;

    return new UploadFileResponseDto(foundFile.toDto(), url);
  }

  async findOne(
    findData:
      | FindOptionsWhere<UploadEntity>
      | Array<FindOptionsWhere<UploadEntity>>,
  ): Promise<Nullable<UploadEntity>> {
    const file = await this.uploadRepository.findOneBy(findData);

    return file;
  }
}
