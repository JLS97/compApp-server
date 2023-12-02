import * as yup from 'yup';
import { Result } from "../../../domain/core/types/Result.js";
import {CoreResponses} from '../../../domain/core/core.responses.js';
import { EventsService } from "../../../domain/events/EventsService.js";
import { ActivityEventInstance } from "../../../domain/activity/entities/ActivityEvent/ActivityEvent.model.js";
import { ActivityEventSchemas } from "../../../domain/activity/entities/ActivityEvent/ActivityEvent.schemas.js";
import { ActivityDatabase } from '../../../domain/activity/activity.database.js';
import { prepareQueryOperation } from '../../../domain/operations/prepareQueryOperation.js';
import { prepareUpdateOperation } from '../../../domain/operations/prepareUpdateOperation.js';
import { ActivityEvents, ActivityEventReadEventPayload } from '../../../domain/activity/activity.events.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export const MarkAsReadError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type MarkAsReadError = typeof MarkAsReadError[keyof typeof MarkAsReadError];

export async function markAsRead(activityDatabase: ActivityDatabase, events: EventsService, receiverId: string, activityEventIds: string[]): Promise<Result<ActivityEventInstance[], MarkAsReadError>>{
  const schema = yup.object().shape({
    receiverId: ActivityEventSchemas.receiverId.required(),
    activityEventIds: yup.array().of(EntitySchemas.id.required()).required(),
  });

  if (!schema.isValidSync({receiverId, activityEventIds: activityEventIds})) {
    return Result.fail(MarkAsReadError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<Omit<ActivityEventInstance, "id"> & {id: string[]}>({receiverId, id: activityEventIds});
  const updateQuery = prepareUpdateOperation<ActivityEventInstance>({isRead: true});

  const result = await activityDatabase.editManyActivityEvents(searchQuery, updateQuery)

  if (result.isFailure) {
    return Result.fail(MarkAsReadError.UNKNOWN);
  }

  result.success.forEach(item => {
    events.emit<ActivityEventReadEventPayload>(ActivityEvents.ACTIVITY_EVENT_READ, item);
  })

  return Result.ok(result.success);
}