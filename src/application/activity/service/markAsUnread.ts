import * as yup from 'yup';
import { Result } from "../../../domain/core/types/Result.js";
import {CoreResponses} from '../../../domain/core/core.responses.js';
import { EventsService } from "../../../domain/events/EventsService.js";
import { ActivityEventInstance } from "../../../domain/activity/entities/ActivityEvent/ActivityEvent.model.js";
import { ActivityEventSchemas } from "../../../domain/activity/entities/ActivityEvent/ActivityEvent.schemas.js";
import { ActivityDatabase } from '../../../domain/activity/activity.database.js';
import { prepareQueryOperation } from '../../../domain/operations/prepareQueryOperation.js';
import { prepareUpdateOperation } from '../../../domain/operations/prepareUpdateOperation.js';
import { ActivityEvents, ActivityEventUnreadEventPayload } from '../../../domain/activity/activity.events.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export const MarkAsUnreadError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type MarkAsUnreadError = typeof MarkAsUnreadError[keyof typeof MarkAsUnreadError];

export async function markAsUnread(activityDatabase: ActivityDatabase, events: EventsService, receiverId: string, activityEventIds: string[]): Promise<Result<ActivityEventInstance[], MarkAsUnreadError>>{
  const schema = yup.object().shape({
    receiverId: ActivityEventSchemas.receiverId.required(),
    activityEventIds: yup.array().of(EntitySchemas.id.required()).required(),
  });

  if (!schema.isValidSync({receiverId, activityEventIds: activityEventIds})) {
    return Result.fail(MarkAsUnreadError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<Omit<ActivityEventInstance, "id"> & {id: string[]}>({receiverId, id: activityEventIds});
  const updateQuery = prepareUpdateOperation<ActivityEventInstance>({isRead: false});

  const result = await activityDatabase.editManyActivityEvents(searchQuery, updateQuery)

  if (result.isFailure) {
    return Result.fail(MarkAsUnreadError.UNKNOWN);
  }

  result.success.forEach(item => {
    events.emit<ActivityEventUnreadEventPayload>(ActivityEvents.ACTIVITY_EVENT_UNREAD, item);
  })

  return Result.ok(result.success);
}