export interface FileToUpload {
  name: string;
  data: Buffer;
  mimetype: string;
  tempFilePath: string;
  sizeInBytes: number;
  encoding?: string;
  md5?: string;
}

export interface FileToUploadValid extends FileToUpload {
  isValid: true;
}

export interface FileToUploadInvalid extends FileToUpload {
  isValid: false;
}

export interface UploadImageOptions {
  maxFiles?: number;
  minFileSize?: number;
  maxFileSize?: number;
  validMimeTypes?: string[];
  destFileName?: string;
  destFolder?: string;
  maxFilesValidator?: (filesArr: FileToUpload[]) => (FileToUploadValid | FileToUploadInvalid)[];
  /** @returns true si pasa la validación */
  fileTypeValidator?: (file: FileToUpload) => boolean;
  /** @returns true si pasa la validación */
  fileMinSizeValidator?: (file: FileToUpload) => boolean;
  /** @returns true si pasa la validación */
  fileMaxSizeValidator?: (file: FileToUpload) => boolean;
}

export interface UploadedFileMeta {
  name: string;
  mimetype: string;
  sizeInBytes: number;
  encoding?: string;
  md5?: string;
}

export interface UploadedFileSuccess<T = string> extends UploadedFileMeta {
  url: T;
}

export interface UploadedFileError<T = string> extends UploadedFileMeta {
  reason: T;
}
