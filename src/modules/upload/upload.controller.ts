import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';

import { RoleType } from '../../constants';
import { ApiFile } from '../../decorators';
import { Auth } from '../../decorators/http.decorators';
import { ParseFile } from '../../pipes/parse-file.pipe';
import { UploadFileResponseDto } from './dtos/res/UploadFileResponseDto';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('file')
  @Auth([RoleType.USER, RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload file' })
  @ApiOkResponse({ description: 'Uploaded file', type: UploadFileResponseDto })
  @ApiFile({ name: 'file' })
  uploadFile(
    @UploadedFile(ParseFile) file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    return this.uploadService.getUploadedFileInfo(file);
  }

  // @Post('files')
  // @Auth([RoleType.USER, RoleType.ADMIN])
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Upload files' })
  // @ApiOkResponse({ description: 'Uploaded files' })
  // @ApiFile({ name: 'file', isArray: true })
  // uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {}
}
