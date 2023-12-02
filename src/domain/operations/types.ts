export type ValueArg = boolean | string | number | bigint | any[] | null | undefined;

export const QueryBaseOperations = {
  eq: 'equals-to',
  ne: 'not-equal-to',
  in: 'includes',
  nin: 'not-includes',
  gt: 'greater-than',
  gte: 'greater-or-equal-than',
  lt: 'lesser-than',
  lte: 'lesser-or-equal-to',
} as const;
export type QueryBaseOperations = (typeof QueryBaseOperations)[keyof typeof QueryBaseOperations];

export const UpdateBaseOperations = {
  substitute: 'substitute',
  push: 'push',
  pull: 'pull',
  merge: 'merge',
} as const;
export type UpdateBaseOperations = (typeof UpdateBaseOperations)[keyof typeof UpdateBaseOperations];

export interface Operation {
  type: string;
}

export type NestedOperation<T> = T extends Record<string, any> ? Record<string, Operation> : never;

/**
 * QUERY OPERATIONS
 */

export abstract class QueryValueOperation<T = ValueArg> implements Operation {
  type: string;
  value: T;

  constructor(type: string){
    this.type = type
  }
}

export class EqOperation<T = ValueArg> extends QueryValueOperation<T> {
  type: typeof QueryBaseOperations.eq;
  value: T;

  constructor(value: T){
    super(QueryBaseOperations.eq);
    this.value = value
  }
}

export class NeOperation<T = ValueArg> extends QueryValueOperation<T> {
  type: typeof QueryBaseOperations.ne;
  value: T;

  constructor(value: T){
    super(QueryBaseOperations.ne);
    this.value = value
  }
}

export class InOperation<T = ValueArg> extends QueryValueOperation<T> {
  type: typeof QueryBaseOperations.in;
  value: T;

  constructor(value: T){
    super(QueryBaseOperations.in);
    this.value = value
  }
}

export class NinOperation<T = ValueArg> extends QueryValueOperation<T> {
  type: typeof QueryBaseOperations.nin;
  value: T;

  constructor(value: T){
    super(QueryBaseOperations.nin);
    this.value = value
  }
}

export class GtOperation<T = ValueArg> extends QueryValueOperation<T> {
  type: typeof QueryBaseOperations.gt;
  value: T;

  constructor(value: T){
    super(QueryBaseOperations.gt);
    this.value = value
  }
}

export class GteOperation<T = ValueArg> extends QueryValueOperation<T> {
  type: typeof QueryBaseOperations.gte;
  value: T;

  constructor(value: T){
    super(QueryBaseOperations.gte);
    this.value = value
  }
}

export class LtOperation<T = ValueArg> extends QueryValueOperation<T> {
  type: typeof QueryBaseOperations.lt;
  value: T;

  constructor(value: T){
    super(QueryBaseOperations.lt);
    this.value = value
  }
}

export class LteOperation<T = ValueArg> extends QueryValueOperation<T> {
  type: typeof QueryBaseOperations.lte;
  value: T;

  constructor(value: T){
    super(QueryBaseOperations.lte);
    this.value = value
  }
}

/**
 * UPDATE OPERATIONS
 */

export abstract class UpdateValueOperation<T = ValueArg> implements Operation {
  type: string;
  value: T;

  constructor(type: string){
    this.type = type
  }
}

export class SubstituteOperation<T = ValueArg> extends UpdateValueOperation<T> {
  type: typeof UpdateBaseOperations.substitute;
  value: T;

  constructor(value: T){
    super(UpdateBaseOperations.substitute);
    this.value = value
  }
}

export class PushOperation<T = ValueArg> extends UpdateValueOperation<T> {
  type: typeof UpdateBaseOperations.push;
  value: T;

  constructor(value: T){
    super(UpdateBaseOperations.push);
    this.value = value
  }
}

export class PullOperation<T = ValueArg> extends UpdateValueOperation<T> {
  type: typeof UpdateBaseOperations.pull;
  value: T;

  constructor(value: T){
    super(UpdateBaseOperations.pull);
    this.value = value
  }
}

export class MergeOperation<T = Record<string, unknown>> extends UpdateValueOperation<T> {
  type: typeof UpdateBaseOperations.merge;
  value: T;

  constructor(value: T){
    super(UpdateBaseOperations.merge);
    this.value = value
  }
}