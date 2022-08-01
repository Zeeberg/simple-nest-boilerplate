import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';

import { UploadType } from '../../common/types';
import { RoleType } from '../../constants';
import { ApiFile, ApiFiles } from '../../decorators';
import { Auth } from '../../decorators/http.decorators';
import { ParseFile } from '../../pipes/parse-file.pipe';
import { UploadFileResponseDto } from './dtos/res/upload-file-response.dto';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('file')
  @Auth([RoleType.USER, RoleType.ADMIN], 'Upload file')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Uploaded file', type: UploadFileResponseDto })
  @ApiFile({ name: UploadType.COMMON })
  uploadFile(
    @UploadedFile(ParseFile) file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    return this.uploadService.getUploadedFileInfo(file);
  }

  @Post('files')
  @Auth([RoleType.USER, RoleType.ADMIN], 'Upload files')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Uploaded files', type: UploadFileResponseDto })
  @ApiFile({ name: UploadType.COMMON, isArray: true })
  uploadFiles(
    @UploadedFiles(ParseFile) files: Express.Multer.File[],
  ): Promise<UploadFileResponseDto[]> {
    return this.uploadService.getUploadedFilesInfo(files);
  }

  @Post('files-group')
  @Auth([RoleType.USER, RoleType.ADMIN], 'Upload files group')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Uploaded files', type: UploadFileResponseDto })
  @ApiFiles([
    {
      name: UploadType.COMMON,
      isArray: true,
      maxCount: 5,
    },
    {
      name: UploadType.AVATAR,
      isArray: true,
      maxCount: 5,
    },
  ])
  uploadFilesGroup(
    @UploadedFiles(ParseFile)
    files: {
      COMMON?: Express.Multer.File[];
      AVATAR?: Express.Multer.File[];
    },
  ): Promise<UploadFileResponseDto[]> {
    return this.uploadService.getUploadedFileFieldsInfo(files);
  }
}
