import { ActivityDatabase } from '../../../../domain/activity/activity.database.js';
import { Result } from '../../../../domain/core/types/Result.js';
import { ActivityEventInstance, ActivityEventValues } from '../../../../domain/activity/entities/ActivityEvent/ActivityEvent.model.js';
import { Operation } from '../../../../domain/operations/types.js';
import { Paginated } from '../../../../domain/core/types/Paginated.js';
import { MongoDBDatabase, MongoDBDatabaseParams } from '../MongoDBDatabase.js';
import { ActivityEventInstanceToDBItem, DBActivityEventInstance, DBActivityEventToItem, dbActivityEventSchema } from './activityEvent/ActivityEventDBModel.js';
import { Model } from 'mongoose';
import { findPaginated } from '../core/operations/findPaginated.js';
import { createOne } from '../core/operations/createOne.js';
import { editOne } from '../core/operations/editOne.js';
import { editMany } from '../core/operations/editMany.js';
import { estimateTotal } from '../core/operations/estimateTotal.js';

export class MongoDBActivityDatabase extends MongoDBDatabase implements ActivityDatabase {
  private activityEventModel: Model<DBActivityEventInstance>;

  constructor(params: MongoDBDatabaseParams){
    super(params);

    const connection = this.getConnection();

    connection.model("ActivityEvent", dbActivityEventSchema);
    this.activityEventModel = connection.model("ActivityEvent");
  }

  // ------------------ //
  // ACTIVITY EVENT
  // ------------------ //
  async findActivityEventsPaginated<T extends ActivityEventInstance>(filters: Partial<Record<keyof T, Operation>>, page: number, pageSize: number): Promise<Result<Paginated<ActivityEventInstance>, undefined>> {
    return await findPaginated(this.activityEventModel, DBActivityEventToItem)(filters, page, pageSize);
  }

  async addActivityEvent<T extends ActivityEventInstance, K extends ActivityEventValues>(instance: Partial<T> & K): Promise<Result<ActivityEventInstance, undefined>> {
    return await createOne(this.activityEventModel, ActivityEventInstanceToDBItem, DBActivityEventToItem)(instance);
  }

  async editActivityEvent<T extends ActivityEventInstance>(searchBy: Partial<Record<keyof T, Operation>>, newValues: Partial<Record<keyof T, Operation>>): Promise<Result<ActivityEventInstance, undefined>> {
    return await editOne(this.activityEventModel, DBActivityEventToItem)(searchBy, newValues);
  }

  async editManyActivityEvents<T extends ActivityEventInstance>(searchBy: Partial<Record<keyof T, Operation>>, newValues: Partial<Record<keyof T, Operation>>): Promise<Result<ActivityEventInstance[], undefined>> {
    return await editMany(this.activityEventModel, DBActivityEventToItem)(searchBy, newValues);
  }
  
  async estimateActivityEvents<T extends ActivityEventInstance>(searchBy: Partial<Record<keyof T, Operation>>): Promise<Result<number, undefined>> {
    return await estimateTotal(this.activityEventModel)(searchBy)
  }
}
