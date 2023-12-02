import {ENV} from '../../env.js';
import {NoopStorageService} from '../../infrastructure/storage/noop/NoopStorageService.js';
import {S3StorageService} from '../../infrastructure/storage/s3/S3StorageService.js';
import {getLogger} from './getLogger.js';

let s3StorageService: S3StorageService;
let noopStorageService: NoopStorageService;

const getS3StorageService = () => {
  if (s3StorageService) {
    return s3StorageService;
  }

  s3StorageService = new S3StorageService({
    accessKey: ENV.STORAGE_S3_ACCESS_KEY,
    secretKey: ENV.STORAGE_S3_SECRET_KEY,
    bucketName: ENV.STORAGE_S3_BUCKET_NAME,
    region: ENV.STORAGE_S3_REGION,
    loggerService: getLogger(),
  });

  return s3StorageService;
};

const getNoopStorageService = () => {
  if (noopStorageService) {
    return noopStorageService;
  }

  noopStorageService = new NoopStorageService();

  return noopStorageService;
};

export function getStorageService() {
  switch (ENV.STORAGE_SERVICE_TYPE) {
    case 's3':
      return getS3StorageService();
    case 'none':
      return getNoopStorageService();
    default:
      throw new Error(`Storage service not supported. Received: ${ENV.STORAGE_SERVICE_TYPE}`);
  }
}
