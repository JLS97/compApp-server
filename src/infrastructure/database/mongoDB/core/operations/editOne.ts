import {Model} from 'mongoose';
import {EntityValues} from '../../../../../domain/core/entities/Entity/Entity.model.js';
import {Operation} from '../../../../../domain/operations/types.js';
import {parseQueryOperation} from '../parsers/parseQueryOperation.js';
import {parseUpdateOperation} from '../parsers/parseUpdateOperation.js';
import {Result} from '../../../../../domain/core/types/Result.js';
import { PartialDeep } from 'type-fest';

export function editOne<DBI, I extends EntityValues>(model: Model<DBI>, dbItemTransformToItem: (value: unknown) => I) {
  return async (searchBy: PartialDeep<Record<keyof I, Operation>>, newValues: PartialDeep<Record<keyof I, Operation>>): Promise<Result<I, undefined>> => {
    const query = parseQueryOperation(searchBy);
    const updateQuery = parseUpdateOperation(newValues);

    const dbItem = await model.findOneAndUpdate(query, updateQuery, {
      strict: false,
      new: true,
    });

    if (!dbItem) {
      return Result.fail();
    }

    const item = dbItemTransformToItem(dbItem);

    return Result.ok(item);
  };
}
