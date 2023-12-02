import {Document, Model} from 'mongoose';
import {EntityValues} from '../../../../../domain/core/entities/Entity/Entity.model.js';
import {Result} from '../../../../../domain/core/types/Result.js';
import {nanoid} from 'nanoid';

export function createMany<DBI, I extends EntityValues, V>(
  model: Model<DBI>,
  itemTransformToDBItem: (value: unknown) => DBI,
  dbItemTransformToItem: (value: unknown) => I,
  modelSelector?: (obj: DBI) => Document
) {
  return async (instances: (Partial<I> & V)[]): Promise<Result<I[], undefined>> => {
    const dbItems = instances.map((item) => {
      const id = item.id ? item.id : nanoid();

      const dbItem = itemTransformToDBItem(item);

      return {...dbItem, id};
    });

    const creationObjects = modelSelector ? (dbItems.map(modelSelector) as unknown[]) : dbItems;

    const newDBItems = await model.create(creationObjects);

    const newItems = newDBItems.map(dbItemTransformToItem);

    return Result.ok(newItems);
  };
}
