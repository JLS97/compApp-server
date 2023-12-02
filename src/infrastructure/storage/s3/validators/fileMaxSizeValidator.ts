import {FileToUpload} from '../../../../domain/storage/types.js';

export function fileMaxSizeValidator(maxSizeInBytes: number) {
  return (file: FileToUpload): boolean => {
    return file.sizeInBytes <= maxSizeInBytes;
  };
}
