import {UploadedFileError, UploadedFileSuccess} from './types.js';

export class UploadedFileResult<T extends UploadedFileSuccess = UploadedFileSuccess, E extends UploadedFileError = UploadedFileError> {
  private readonly _value?: T;
  private readonly _error?: E;

  protected constructor(value?: T, error?: E) {
    this._value = value;
    this._error = error;
  }

  static ok<T extends UploadedFileSuccess, E extends UploadedFileError>(value?: T): UploadedFileResult<T, E> {
    return new UploadedFileResult<T, E>(value, null);
  }

  static fail<T extends UploadedFileSuccess, E extends UploadedFileError>(error?: NonNullable<E>): UploadedFileResult<T, E> {
    // the error cannot be null because it's the value we use to determine if the result is a failure or a success
    return new UploadedFileResult<T, E>(null, error);
  }

  get isSuccess(): boolean {
    return this._error === null;
  }

  get isFailure(): boolean {
    return this._error !== null;
  }

  get success(): T {
    if (this.isFailure) {
      throw new Error('Cannot get the value from an error');
    }

    return this._value!;
  }

  get failure(): E {
    if (this.isSuccess) {
      throw new Error('Cannot get the error from a success');
    }

    return this._error!;
  }

  map<U extends UploadedFileSuccess>(fn: (value: T) => U): UploadedFileResult<U, E> {
    if (this.isSuccess) {
      return UploadedFileResult.ok(fn(this._value!));
    }

    return UploadedFileResult.fail<U, E>(this._error!);
  }
}
