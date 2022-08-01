import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { HttpException, HttpStatus, Injectable, mixin } from '@nestjs/common';
import { FileFieldsInterceptor as NestFileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';

import { UploadType } from '../common/types';
import { UploadFormats } from '../common/types/upload-formats.enum';
import type { IApiFiles } from '../interfaces/IApiFiles';
import { UploadRepository } from '../modules/upload/upload.repository';
import { ApiConfigService } from '../shared/services/api-config.service';
import { CodeGeneratorService } from '../shared/services/code-generator.service';

export function fileFiledsInterceptor(
  apiFiles: IApiFiles[],
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    constructor(
      private readonly codeGeneratorService: CodeGeneratorService,
      private readonly configService: ApiConfigService,
      private readonly uploadRepository: UploadRepository,
    ) {}

    private async insertToRepository(file: Express.Multer.File, name: string) {
      const upload = this.uploadRepository.create({
        fileName: name,
        mimeType: file.mimetype,
        type: UploadType[file.fieldname],
      });
      await upload.save();
    }

    intercept(context: ExecutionContext, next: CallHandler) {
      const fileIntConst = NestFileFieldsInterceptor(apiFiles, {
        limits: {
          fileSize: this.configService.uploadConfig.maxFileSize,
        },
        fileFilter: (_request, file, callback) => {
          const extension = path.extname(file.originalname);

          const allowedFilesString = UploadFormats[file.fieldname];

          const allowedFiles = allowedFilesString
            .split(',')
            .map((index) => index.trim());

          if (!allowedFiles.includes(extension.toLowerCase())) {
            callback(
              new HttpException(
                `${file.fieldname}.unsupportedFileType`,
                HttpStatus.BAD_REQUEST,
              ),
              false,
            );

            return;
          }

          // eslint-disable-next-line unicorn/no-null
          callback(null, true);
        },
        storage: diskStorage({
          destination: this.configService.uploadConfig.uploadDirectory,
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          filename: async (request, file, callback) => {
            const name =
              this.codeGeneratorService.generateCode(
                this.configService.uploadConfig.fileNameLength,
                this.configService.uploadConfig.fileNameCharacters,
              ) + path.extname(file.originalname);

            await this.insertToRepository(file, name);

            // eslint-disable-next-line unicorn/no-null
            callback(null, name);
          },
        }),
      });
      const fileInt = new fileIntConst();

      return fileInt.intercept(context, next);
    }
  }

  return mixin(Interceptor);
}
