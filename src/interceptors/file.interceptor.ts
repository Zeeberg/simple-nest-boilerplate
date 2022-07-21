import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { HttpException, HttpStatus, Injectable, mixin } from '@nestjs/common';
import { FileInterceptor as NestFileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';

import type { IApiFile } from '../interfaces';
import { UploadRepository } from '../modules/upload/upload.repository';
import { ApiConfigService } from '../shared/services/api-config.service';
import { CodeGeneratorService } from '../shared/services/code-generator.service';

export function fileInterceptor(
  apiFile: IApiFile,
  filesLimit?: number,
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
      });
      await upload.save();
    }

    intercept(context: ExecutionContext, next: CallHandler) {
      const fileIntConst = NestFileInterceptor(apiFile.name, {
        limits: {
          files: filesLimit,
          fileSize: this.configService.uploadConfig.maxFileSize,
        },
        fileFilter: (_request, file, callback) => {
          const extension = path.extname(file.originalname);
          const allowedFiles =
            this.configService.uploadConfig.allowedFileExtensions
              .split(',')
              .map((index) => index.trim());

          if (!allowedFiles.includes(extension)) {
            callback(
              new HttpException(
                'upload.unsupportedFileType',
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
          filename: (request, file, callback) => {
            const name =
              this.codeGeneratorService.generateCode(
                this.configService.uploadConfig.fileNameLength,
                this.configService.uploadConfig.fileNameCharacters,
              ) + path.extname(file.originalname);

            void (async () => {
              await this.insertToRepository(file, name);
            })();

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
