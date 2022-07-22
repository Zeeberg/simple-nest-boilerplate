import { Injectable, NotFoundException } from '@nestjs/common';
import type { FindOptionsWhere } from 'typeorm';
import { In } from 'typeorm';

import { ApiConfigService } from '../../shared/services/api-config.service';
import type { Nullable } from '../../types';
import { UploadFileResponseDto } from './dtos/res/upload-file-response.dto';
import type { UploadEntity } from './upload.entity';
import { UploadRepository } from './upload.repository';

@Injectable()
export class UploadService {
  constructor(
    private uploadRepository: UploadRepository,
    private readonly configService: ApiConfigService,
  ) {}

  private createUrl(file: UploadEntity) {
    const url = `${
      this.configService.serverUrl
    }${this.configService.uploadConfig.uploadDirectory.slice(2)}/${
      file.fileName
    }`;

    return url;
  }

  async getUploadedFileInfo(
    file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    const foundFile = await this.findOne({
      fileName: file.filename,
    });

    if (!foundFile) {
      throw new NotFoundException('upload.fileNotFound');
    }

    const url = this.createUrl(foundFile);

    return new UploadFileResponseDto(foundFile.toDto(), url);
  }

  async getUploadedFilesInfo(
    files: Express.Multer.File[],
  ): Promise<UploadFileResponseDto[]> {
    const [foundFiles, filesCount] = await this.uploadRepository.findAndCount({
      where: { fileName: In(files.map((file) => file.filename)) },
    });

    if (filesCount !== files.length) {
      throw new NotFoundException('upload.someFilesNotFound');
    }

    const res = foundFiles.map((file) => {
      const url = this.createUrl(file);

      return new UploadFileResponseDto(file.toDto(), url);
    });

    return res;
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
