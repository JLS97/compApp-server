import { Model } from "mongoose";
import { PartialDeep } from "type-fest";
import { Operation } from "../../../../../domain/operations/types.js";
import { Result } from "../../../../../domain/core/types/Result.js";
import { parseQueryOperation } from "../parsers/parseQueryOperation.js";

export function removeOne<DBI, I>(model: Model<DBI>, dbItemTransformToItem: (value: unknown) => I){
  return async (criteria: PartialDeep<Record<keyof I, Operation>>): Promise<Result<I, undefined>> => {
    const query = parseQueryOperation(criteria);

    const dbItem = await model.findOneAndDelete(query);

    if (!dbItem) {
      return Result.fail();
    }

    const item = dbItemTransformToItem(dbItem);

    return Result.ok(item);
  }
}