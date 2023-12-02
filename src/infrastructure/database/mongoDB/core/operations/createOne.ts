import {Document, Model} from 'mongoose';
import {nanoid} from 'nanoid/async';
import {EntityValues} from '../../../../../domain/core/entities/Entity/Entity.model.js';
import {Result} from '../../../../../domain/core/types/Result.js';

export function createOne<DBI, I extends EntityValues, V>(
  model: Model<DBI>,
  itemTransformToDBItem: (value: unknown) => DBI,
  dbItemTransformToItem: (value: unknown) => I,
  modelSelector?: (obj: DBI) => Document,
) {
  return async (instance: Partial<I> & V): Promise<Result<I, undefined>> => {
    const id = instance.id ? instance.id : await nanoid();

    const dbItem = itemTransformToDBItem(instance);

    const creationObject = modelSelector ? modelSelector({...dbItem, id}) : {...dbItem, id}

    const newDBItem = await model.create(creationObject);

    const newItem = dbItemTransformToItem(newDBItem);

    return Result.ok(newItem);
  };
}
