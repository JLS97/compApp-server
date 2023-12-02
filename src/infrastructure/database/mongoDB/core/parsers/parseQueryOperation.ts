import {
  QueryBaseOperations,
  EqOperation,
  GtOperation,
  GteOperation,
  InOperation,
  LtOperation,
  LteOperation,
  NeOperation,
  NinOperation,
  Operation,
} from '../../../../../domain/operations/types.js';

export function parseQueryOperation<T>(filters: Partial<Record<keyof T, Operation>>) {
  const parsedFilters = Object.entries(filters).map(([key, value]: [string, Operation]) => {
    switch (value.type) {
      case QueryBaseOperations.eq: {
        const operation = value as EqOperation;
        return [key, parseEqOperation(operation)];
      }
      case QueryBaseOperations.ne: {
        const operation = value as NeOperation;
        return [key, parseNeOperation(operation)];
      }
      case QueryBaseOperations.in: {
        const operation = value as InOperation;
        return [key, parseInOperation(operation)];
      }
      case QueryBaseOperations.nin: {
        const operation = value as NinOperation;
        return [key, parseNinOperation(operation)];
      }
      case QueryBaseOperations.gt: {
        const operation = value as GtOperation;
        return [key, parseGtOperation(operation)];
      }
      case QueryBaseOperations.gte: {
        const operation = value as GteOperation;
        return [key, parseGteOperation(operation)];
      }
      case QueryBaseOperations.lt: {
        const operation = value as LtOperation;
        return [key, parseLtOperation(operation)];
      }
      case QueryBaseOperations.lte: {
        const operation = value as LteOperation;
        return [key, parseLteOperation(operation)];
      }
      default:
        throw new Error(`Operation not supported: ${value.type}`);
    }
  });

  return Object.fromEntries(parsedFilters);
}

function parseEqOperation(op: EqOperation) {
  return op.value;
}

function parseNeOperation(op: NeOperation) {
  return {
    $ne: op.value,
  };
}

function parseInOperation(op: InOperation) {
  return {
    $in: op.value,
  };
}

function parseNinOperation(op: NinOperation) {
  return {
    $nin: op.value,
  };
}

function parseGtOperation(op: GtOperation) {
  return {
    $gt: op.value,
  };
}

function parseGteOperation(op: GteOperation) {
  return {
    $gte: op.value,
  };
}

function parseLtOperation(op: LtOperation) {
  return {
    $lt: op.value,
  };
}

function parseLteOperation(op: LteOperation) {
  return {
    $lte: op.value,
  };
}
