import { Model } from "mongoose";
import { Result } from "../../../../../domain/core/types/Result.js";
import { Operation } from "../../../../../domain/operations/types.js";
import { parseQueryOperation } from "../parsers/parseQueryOperation.js";
import { PartialDeep } from "type-fest";

export function findMany<DBI, I>(model: Model<DBI>, dbItemTransformToItem: (value: unknown) => I) {

  return async (filters: PartialDeep<Record<keyof I, Operation>>): Promise<Result<I[], undefined>> => {
    const query = parseQueryOperation(filters);
  
    const dbItems = await model.find(query);
  
    const items = dbItems.map(dbItemTransformToItem);
  
    return Result.ok(items);
  }
}