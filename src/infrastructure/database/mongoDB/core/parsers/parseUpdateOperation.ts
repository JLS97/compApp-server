import { flattenObject } from '../../../../../domain/core/utils/flattenObject.js';
import {MergeOperation, Operation, PullOperation, PushOperation, SubstituteOperation, UpdateBaseOperations} from '../../../../../domain/operations/types.js';
import groupBy from 'lodash.groupby';

export function parseUpdateOperation<T>(fields: Partial<Record<keyof T, Operation>>) {
  const parsedFields = Object.entries<Operation>(fields)

  const groupedOperations = groupBy(parsedFields, ([, operation]) => {
    return operation.type;
  });

  const operationTypes = Object.keys(groupedOperations);
  
  const formattedOperations = operationTypes.map((type) => {
    switch(type){
      case UpdateBaseOperations.substitute: {
        const fieldOperations = groupedOperations[type].map(([key, op]: [string, SubstituteOperation]) => {
          return [key, op.value];
        })

        return parseSubstituteOperations(Object.fromEntries(fieldOperations));
      }
      case UpdateBaseOperations.push: {
        const fieldOperations = groupedOperations[type].map(([key, op]: [string, PushOperation]) => {
          return [key, op.value];
        })

        return parsePushOperation(Object.fromEntries(fieldOperations));
      }
      case UpdateBaseOperations.pull: {
        const fieldOperations = groupedOperations[type].map(([key, op]: [string, PullOperation]) => {
          return [key, op.value];
        })

        return parsePullOperation(Object.fromEntries(fieldOperations));
      }
      case UpdateBaseOperations.merge: {
        const fieldOperations = groupedOperations[type].map(([key, op]: [string, MergeOperation]) => {
          return [key, op.value];
        })

        return parseMergeOperation(Object.fromEntries(fieldOperations));
      }
      default:
        throw new Error(`Operation not found: ${type}`);
    }
  });

  const fullUpdate = formattedOperations.reduce((acc, next) => {
    return {
      ...acc,
      ...next,
    }
  }, {});

  return fullUpdate;
}

function parseSubstituteOperations(record: Record<string, unknown>) {
  return {
    $set: record
  };
}

function parsePushOperation(record: Record<string, unknown>) {
  return {
    $push: record
  };
}

function parsePullOperation(record: Record<string, unknown>) {
  return {
    $pull: record
  };
}

function parseMergeOperation(record: Record<string, unknown>) {
  const flattenedChanges = flattenObject(record);

  return {
    $set: flattenedChanges
  }
}
