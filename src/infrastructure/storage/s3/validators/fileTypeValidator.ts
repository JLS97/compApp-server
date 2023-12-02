import {FileToUpload} from '../../../../domain/storage/types.js';

export function fileTypeValidator(validMimeTypes: string[]) {
  return (file: FileToUpload): boolean => {
    return validMimeTypes.includes(file.mimetype);
  };
}
