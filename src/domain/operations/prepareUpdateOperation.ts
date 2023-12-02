import { PartialDeep } from 'type-fest';
import { UpdateOperations } from './UpdateOperations.js';
import {NestedOperation, UpdateValueOperation} from './types.js';

export function prepareUpdateOperation<T extends Record<string, any>>(obj: PartialDeep<T>): NestedOperation<T> {
  const formattedOperations = Object.entries(obj)
    .filter(([, value]) => {
      return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'bigint' ||
        typeof value === 'boolean' ||
        value === null ||
        Array.isArray(value) ||
        typeof value === 'object' ||
        value instanceof UpdateValueOperation
      );
    })
    .map(([key, value]) => {
      if(value instanceof UpdateValueOperation){
        return [key, value];
      }

      if (value === null) {
        return [key, UpdateOperations.substitute(undefined)];
      }

      return [key, UpdateOperations.substitute(value)];
    });

  return Object.fromEntries(formattedOperations);
}
