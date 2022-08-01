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

import { RoleType } from '../../constants';
import { ApiFile } from '../../decorators';
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
  @ApiFile({ name: 'file' })
  uploadFile(
    @UploadedFile(ParseFile) file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    return this.uploadService.getUploadedFileInfo(file);
  }

  @Post('files')
  @Auth([RoleType.USER, RoleType.ADMIN], 'Upload files')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Uploaded files', type: UploadFileResponseDto })
  @ApiFile({ name: 'files', isArray: true })
  uploadFiles(
    @UploadedFiles(ParseFile) files: Express.Multer.File[],
  ): Promise<UploadFileResponseDto[]> {
    return this.uploadService.getUploadedFilesInfo(files);
  }
}
