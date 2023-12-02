import {StorageService} from '../../../domain/storage/StorageService.js';
import {FileToUpload, UploadImageOptions} from '../../../domain/storage/types.js';
import {UploadedFileResult} from '../../../domain/storage/UploadedFileResult.js';

export class NoopStorageService extends StorageService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async uploadPublicImage(files: FileToUpload | FileToUpload[], options: UploadImageOptions): Promise<UploadedFileResult[]> {
    return [];
  }
}
