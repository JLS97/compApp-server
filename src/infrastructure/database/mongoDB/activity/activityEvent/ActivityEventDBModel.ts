import {Document, Schema} from 'mongoose';
import { ActivityEvent, ActivityEventInstance, ActivityEventValues } from '../../../../../domain/activity/entities/ActivityEvent/ActivityEvent.model.js';

export interface DBActivityEventValue {
  type: string,
  isRead?: boolean,
  receiverId: string,
  affectedId?: string,
}

export interface DBActivityEventInstance extends DBActivityEventValue {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const dbActivityEventSchema = new Schema<DBActivityEventInstance>(
  {
    id: {type: String, required: true, unique: true},
    type: {type: String, required: true},
    isRead: {type: Boolean},
    receiverId: {type: String, required: true},
    affectedId: {type: String},
  },
  {
    collection: 'activity_activityEvents',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

export function DBActivityEventToItem(dbItem: DBActivityEventValue & Document): ActivityEvent {
  return new ActivityEvent({
    ...dbItem.toJSON(),
  });
}

export function ActivityEventValueToDBItem(item: ActivityEventValues): DBActivityEventValue {
  const value = new ActivityEvent(item);
  return {
    ...value.values(),
  };
}

export function ActivityEventInstanceToDBItem(item: ActivityEventInstance): DBActivityEventInstance {
  const instance = new ActivityEvent(item);
  return {
    ...instance.instanceValues(),
  };
}
