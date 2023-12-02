import { PartialDeep } from "type-fest";
import { Paginated } from "../../../../../domain/core/types/Paginated.js";
import { Result } from "../../../../../domain/core/types/Result.js";
import { Operation } from "../../../../../domain/operations/types.js";
import { parseQueryOperation } from "../parsers/parseQueryOperation.js";
import { Model } from "mongoose";

export function findPaginated<DBI, I>(model: Model<DBI>, dbItemTransformToItem: (value: unknown) => I){
  return async (filters: PartialDeep<Record<keyof DBI, Operation>>, page: number, pageSize: number): Promise<Result<Paginated<I>, undefined>> => {
    const query = parseQueryOperation(filters);
    const recordsToSkip = (page - 1) * pageSize;

    const dbItems = await model.find(query).skip(recordsToSkip).limit(pageSize);

    const items = dbItems.map(dbItemTransformToItem);

    const total = await model.estimatedDocumentCount(query);

    return Result.ok({
      data: items,
      page,
      pageSize,
      total,
    });
  }
}