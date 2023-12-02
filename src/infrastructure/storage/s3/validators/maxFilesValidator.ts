import {FileToUpload, FileToUploadInvalid, FileToUploadValid} from '../../../../domain/storage/types.js';

export function maxFilesValidator(maxNumber: number) {
  return (filesArr: FileToUpload[]): (FileToUploadValid | FileToUploadInvalid)[] => {
    const successes = filesArr.slice(0, maxNumber).map((item) => ({...item, isValid: true}));
    const errors = filesArr.slice(maxNumber).map((item) => ({...item, isValid: false}));

    return [...successes, ...errors];
  };
}
