import { PartialDeep } from 'type-fest';
import {QueryOperations} from './QueryOperations.js';
import {NestedOperation, QueryValueOperation} from './types.js';

export function prepareQueryOperation<T extends Record<string, any>>(obj: PartialDeep<T>): NestedOperation<T> {
  const formattedOperations = Object.entries(obj)
    .filter(([, value]) => {
      return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'bigint' ||
        typeof value === 'boolean' ||
        value === null ||
        Array.isArray(value) || 
        value instanceof QueryValueOperation
      );
    })
    .map(([key, value]) => {
      if(value instanceof QueryValueOperation){
        return [key, value];
      }

      if (Array.isArray(value)) {
        return [key, QueryOperations.includes(value)];
      }

      return [key, QueryOperations.equals(value)];
    });

  return Object.fromEntries(formattedOperations);
}
