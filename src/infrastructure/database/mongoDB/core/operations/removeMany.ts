import {Model} from 'mongoose';
import {PartialDeep} from 'type-fest';
import {Operation} from '../../../../../domain/operations/types.js';
import {Result} from '../../../../../domain/core/types/Result.js';
import {parseQueryOperation} from '../parsers/parseQueryOperation.js';

export function removeMany<DBI, I>(model: Model<DBI>, dbItemTransformToItem: (value: unknown) => I) {
  return async (criteria: PartialDeep<Record<keyof I, Operation>>): Promise<Result<I[], undefined>> => {
    const query = parseQueryOperation(criteria);

    const dbItemsToDelete = await model.find(query);

    const idsToDelete = dbItemsToDelete.map((item) => item.id);

    await model.deleteMany({
      id: {
        $in: idsToDelete,
      },
    });

    const items = dbItemsToDelete.map(dbItemTransformToItem);

    return Result.ok(items);
  };
}
