import type { PipeTransform } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { Express } from 'express';

@Injectable()
export class ParseFile implements PipeTransform {
  transform(
    files: Express.Multer.File | Express.Multer.File[],
  ): Express.Multer.File | Express.Multer.File[] {
    if (files === undefined || files === null) {
      throw new BadRequestException('upload.validationFailed');
    }

    if (Array.isArray(files) && files.length === 0) {
      throw new BadRequestException('upload.validationFailed');
    }

    return files;
  }
}
