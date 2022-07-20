import { Repository } from 'typeorm';

import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { UploadEntity } from './upload.entity';

@CustomRepository(UploadEntity)
export class UploadRepository extends Repository<UploadEntity> {}
