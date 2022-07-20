import { Module } from '@nestjs/common';

import { TypeOrmExModule } from '../../database/typeorm-ex.module';
import { CodeGeneratorService } from '../../shared/services/code-generator.service';
import { UploadController } from './upload.controller';
import { UploadRepository } from './upload.repository';
import { UploadService } from './upload.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UploadRepository])],
  controllers: [UploadController],
  providers: [UploadService, CodeGeneratorService],
})
export class UploadModule {}
