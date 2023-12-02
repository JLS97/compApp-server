import {S3Client} from '@aws-sdk/client-s3';
import {StorageService} from '../../../domain/storage/StorageService.js';
import {UploadedFileResult} from '../../../domain/storage/UploadedFileResult.js';
import {FileToUpload, UploadImageOptions} from '../../../domain/storage/types.js';
import {uploadPublicImage} from './services/uploadPublicImage.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';
import {fileTypeValidator} from './validators/fileTypeValidator.js';
import {maxFilesValidator} from './validators/maxFilesValidator.js';
import {fileMaxSizeValidator} from './validators/fileMaxSizeValidator.js';
import {fileMinSizeValidator} from './validators/fileMinSizeValidator.js';

export interface S3StorageServiceParams {
  accessKey: string;
  secretKey: string;
  region: string;
  bucketName: string;
  loggerService?: LoggerService;
}

export class S3StorageService implements StorageService {
  private _s3: S3Client;
  private _bucketName: string;
  private _logger?: LoggerService;

  constructor(params: S3StorageServiceParams) {
    this._s3 = new S3Client({
      region: params.region,
      credentials: {
        accessKeyId: params.accessKey,
        secretAccessKey: params.secretKey,
      },
    });
    this._bucketName = params.bucketName;
    this._logger = params.loggerService;
  }

  async uploadPublicImage(files: FileToUpload | FileToUpload[], options: UploadImageOptions): Promise<UploadedFileResult[]> {
    return await uploadPublicImage({
      s3: this._s3,
      bucketName: this._bucketName,
      logger: this._logger,
      files,
      options: {
        fileMinSizeValidator: options.maxFileSize ? fileMinSizeValidator(options.minFileSize) : undefined,
        fileMaxSizeValidator: options.maxFileSize ? fileMaxSizeValidator(options.maxFileSize) : undefined,
        fileTypeValidator: options.validMimeTypes ? fileTypeValidator(options.validMimeTypes) : undefined,
        maxFilesValidator: options.maxFiles ? maxFilesValidator(options.maxFiles) : undefined,
        ...options,
      },
    });
  }
}
