import {Upload} from '@aws-sdk/lib-storage';
import {CompleteMultipartUploadCommandOutput, S3Client} from '@aws-sdk/client-s3';
import mime from 'mime-types';
import {FileToUpload, UploadImageOptions} from '../../../../domain/storage/types.js';
import {UploadedFileResult} from '../../../../domain/storage/UploadedFileResult.js';
import {LoggerService} from '../../../../domain/logger/LoggerService.js';
import {StorageResponses} from '../../../../domain/storage/storage.responses.js';
import {readFile} from 'fs/promises';
import path from 'path';
import {CoreResponses} from '../../../../domain/core/core.responses.js';

export interface UploadPublicImageParams {
  s3: S3Client;
  bucketName: string;
  files: FileToUpload | FileToUpload[];
  options: UploadImageOptions;
  logger?: LoggerService;
}

export async function uploadPublicImage(params: UploadPublicImageParams): Promise<UploadedFileResult[]> {
  const arrayOfFiles = Array.isArray(params.files) ? params.files : [params.files];
  const results: UploadedFileResult[] = [];
  let maxFilesValidatorErrors: UploadedFileResult[] = [];
  let filesToUpload: FileToUpload[] = [];

  if (!params.options.maxFilesValidator) {
    filesToUpload = arrayOfFiles;
    return;
  }

  const validations = params.options.maxFilesValidator(arrayOfFiles);
  filesToUpload = validations.filter((item) => item.isValid);
  maxFilesValidatorErrors = validations
    .filter((item) => !item.isValid)
    .map((item) => UploadedFileResult.fail({...item, reason: StorageResponses.TooManyFiles.STORAGE_TOO_MANY_FILES}));

  // En el futuro se podría realizar la subida por bloques. De momento lo hacemos así para no llegar a ningún límite de api
  for await (const file of filesToUpload) {
    try {
      if (params.options.fileTypeValidator && !params.options.fileTypeValidator(file)) {
        results.push(UploadedFileResult.fail({...file, reason: StorageResponses.InvalidFileType.STORAGE_INVALID_FILE_TYPE}));
        continue;
      }

      if (params.options.fileMinSizeValidator && !params.options.fileMinSizeValidator(file)) {
        results.push(UploadedFileResult.fail({...file, reason: StorageResponses.FileTooSmall.STORAGE_FILE_TOO_SMALL}));
        continue;
      }

      if (params.options.fileMaxSizeValidator && !params.options.fileMaxSizeValidator(file)) {
        results.push(UploadedFileResult.fail({...file, reason: StorageResponses.FileTooBig.STORAGE_FILE_TOO_BIG}));
        continue;
      }

      const buffer = await readFile(file.tempFilePath);
      const extension = mime.extension(file.mimetype);
      const fileName = params.options.destFileName ? `${params.options.destFileName}.${extension}` : file.name;
      const fullPath = params.options.destFolder ? path.join(params.options.destFolder, fileName) : fileName;

      const uploadPromise = new Upload({
        client: params.s3,
        params: {
          Bucket: params.bucketName,
          Key: fullPath,
          Body: buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        },
        leavePartsOnError: false,
      });

      const successResult = (await uploadPromise.done()) as CompleteMultipartUploadCommandOutput;

      results.push(
        UploadedFileResult.ok({
          name: fileName,
          mimetype: file.mimetype,
          sizeInBytes: file.sizeInBytes,
          url: successResult.Location,
          encoding: file.encoding,
          md5: file.md5,
        })
      );
    } catch (_error) {
      const error = _error as Error;
      params.logger?.error(error);
      results.push(
        UploadedFileResult.fail({
          name: file.name,
          mimetype: file.mimetype,
          sizeInBytes: file.sizeInBytes,
          encoding: file.encoding,
          md5: file.md5,
          reason: CoreResponses.Unknown.UNKNOWN,
        })
      );
    }
  }

  return [...results, ...maxFilesValidatorErrors];
}
