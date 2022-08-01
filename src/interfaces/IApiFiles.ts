import type { UploadType } from 'common/types';

export interface IApiFiles {
  name: UploadType;
  isArray?: boolean;
  maxCount: number;
}
