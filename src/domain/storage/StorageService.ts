// https://stackoverflow.com/a/69216651

import {UploadedFileResult} from './UploadedFileResult.js';
import {FileToUpload, UploadImageOptions} from './types.js';

export abstract class StorageService {
  abstract uploadPublicImage(files: FileToUpload | FileToUpload[], options: UploadImageOptions): Promise<UploadedFileResult[]>;
  // abstract uploadPrivateImage(ownerIds: string[], files: FileToUpload | FileToUpload[], options: UploadPublicImageOptions): Promise<UploadedFileResult[]>;
}
