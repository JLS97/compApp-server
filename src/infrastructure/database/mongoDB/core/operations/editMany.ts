import { Model } from "mongoose";
import { Result } from "../../../../../domain/core/types/Result.js";
import { Operation } from "../../../../../domain/operations/types.js";
import { parseQueryOperation } from "../parsers/parseQueryOperation.js";
import { parseUpdateOperation } from "../parsers/parseUpdateOperation.js";
import { PartialDeep } from "type-fest";

export function editMany<DBI, I>(model: Model<DBI>, dbItemTransformToItem: (value: unknown) => I){
  return async (
    searchBy: PartialDeep<Record<keyof I, Operation>>,
    newValues: PartialDeep<Record<keyof I, Operation>>
  ): Promise<Result<I[], undefined>> => {
    const query = parseQueryOperation(searchBy);
    const updateQuery = parseUpdateOperation(newValues);

    await model.updateMany(query, updateQuery, {
      strict: false,
    });

    const updatedDBitems = await model.find(query);

    const updatedItems = updatedDBitems.map(dbItemTransformToItem);

    return Result.ok(updatedItems);
  }
}