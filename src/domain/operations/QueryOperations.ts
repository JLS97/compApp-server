import {EqOperation, GtOperation, GteOperation, InOperation, LtOperation, LteOperation, NeOperation, NinOperation, ValueArg} from './types.js';

export const QueryOperations = {
  equals: <T extends ValueArg>(value: T): EqOperation<T> => {
    return new EqOperation(value);
  },
  notEquals: <T extends ValueArg>(value: T): NeOperation<T> => {
    return new NeOperation(value);
  },
  includes: <T extends ValueArg>(value: T): InOperation<T> => {
    return new InOperation(value);
  },
  notIncludes: <T extends ValueArg>(value: T): NinOperation<T> => {
    return new NinOperation(value);
  },
  greaterThan: <T extends ValueArg>(value: T): GtOperation<T> => {
    return new GtOperation(value);
  },
  greaterOrEqualThan: <T extends ValueArg>(value: T): GteOperation<T> => {
    return new GteOperation(value);
  },
  lesserThan: <T extends ValueArg>(value: T): LtOperation<T> => {
    return new LtOperation(value);
  },
  lessOrEqualThan: <T extends ValueArg>(value: T): LteOperation<T> => {
    return new LteOperation(value);
  },
};
