import {FileToUpload} from '../../../../domain/storage/types.js';

export function fileMinSizeValidator(minSizeInBytes: number) {
  return (file: FileToUpload): boolean => {
    return file.sizeInBytes >= minSizeInBytes;
  };
}
