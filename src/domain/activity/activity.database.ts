import { Paginated } from "../core/types/Paginated.js";
import { Result } from "../core/types/Result.js";
import { Operation } from "../operations/types.js";
import { ActivityEventInstance, ActivityEventValues } from "./entities/ActivityEvent/ActivityEvent.model.js";

export abstract class ActivityDatabase {
  // ------------------ //
  // ACTIVITY EVENT
  // ------------------ //
  abstract findActivityEventsPaginated<T extends ActivityEventInstance>(filters: Partial<Record<keyof T, Operation>>, page: number, pageSize: number): Promise<Result<Paginated<ActivityEventInstance>, undefined>>;
  abstract editActivityEvent<T extends ActivityEventInstance>(searchBy: Partial<Record<keyof T, Operation>>, newValues: Partial<Record<keyof T, Operation>>): Promise<Result<ActivityEventInstance, undefined>>
  abstract editManyActivityEvents<T extends ActivityEventInstance>(searchBy: Partial<Record<keyof T, Operation>>, newValues: Partial<Record<keyof T, Operation>>): Promise<Result<ActivityEventInstance[], undefined>>
  abstract addActivityEvent<T extends ActivityEventInstance, K extends ActivityEventValues>(instance: Partial<T> & K): Promise<Result<ActivityEventInstance, undefined>>;
  abstract estimateActivityEvents<T extends ActivityEventInstance>(searchBy: Partial<Record<keyof T, Operation>>): Promise<Result<number, undefined>>
}