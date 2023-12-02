import * as yup from 'yup';
import { Entity, EntityValues } from '../../../core/entities/Entity/Entity.model.js';
import { ActivityEventSchemas } from './ActivityEvent.schemas.js';
import { PartialDeep } from 'type-fest';

export interface ActivityEventValues {
  type: string,
  isRead?: boolean,
  receiverId: string,
  affectedId?: string
}

export type ActivityEventInstance = EntityValues & ActivityEventValues;

export class ActivityEvent extends Entity implements ActivityEventInstance {
  type: string;
  isRead?: boolean;
  receiverId: string;
  affectedId?: string;

  static _updateValueSchema = yup.object().shape({
    type: ActivityEventSchemas.type,
    isRead: ActivityEventSchemas.isRead,
    receiverId: ActivityEventSchemas.receiverId,
    affectedId: ActivityEventSchemas.affectedId,
  });

  static _createValueSchema = yup.object().shape({
    ...ActivityEvent._updateValueSchema.fields,
    type: ActivityEventSchemas.type.required(),
    receiverId: ActivityEventSchemas.receiverId.required(),
  });

  static _instanceSchema = yup.object().shape({
    ...Entity._instanceSchema.fields,
    ...ActivityEvent._createValueSchema.fields,
  });

  constructor(params: PartialDeep<ActivityEventInstance>) {
    super(params, ActivityEvent._instanceSchema);
  }

  isValidUpdateValue(): boolean {
    return super._isValidValue(ActivityEvent._updateValueSchema)
  }

  isValidCreateValue(): boolean {
    return super._isValidValue(ActivityEvent._createValueSchema)
  }

  isValidInstance(): boolean {
    return super._isValidValue(ActivityEvent._instanceSchema)
  }

  values<T = ActivityEventValues>(): T {
    return super._values<T>(ActivityEvent._createValueSchema);
  }

  instanceValues<T = ActivityEventInstance>(): T {
    return super._values<T>(ActivityEvent._instanceSchema);
  }
}