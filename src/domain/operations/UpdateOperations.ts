import {MergeOperation, PullOperation, PushOperation, SubstituteOperation, ValueArg} from './types.js';

export const UpdateOperations = {
  substitute: <T extends ValueArg>(value: T): SubstituteOperation<T> => {
    return new SubstituteOperation(value);
  },
  push: <T extends ValueArg>(value: T): PushOperation<T> => {
    return new PushOperation(value);
  },
  pull: <T extends ValueArg>(value: T): PullOperation<T> => {
    return new PullOperation(value);
  },
  merge: <T extends ValueArg>(value: T): MergeOperation<T> => {
    return new MergeOperation(value);
  },
};
