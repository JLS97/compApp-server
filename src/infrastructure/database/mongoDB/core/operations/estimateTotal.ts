import { Model } from "mongoose";
import { Result } from "../../../../../domain/core/types/Result.js";
import { parseQueryOperation } from "../parsers/parseQueryOperation.js";
import { PartialDeep } from "type-fest";
import { Operation } from "../../../../../domain/operations/types.js";

export function estimateTotal<DBI, I>(model: Model<DBI>){
  return async (filters: PartialDeep<Record<keyof I, Operation>>): Promise<Result<number, undefined>> => {
    const query = parseQueryOperation(filters);

    const total = await model.estimatedDocumentCount(query);

    return Result.ok(total);
  }
}