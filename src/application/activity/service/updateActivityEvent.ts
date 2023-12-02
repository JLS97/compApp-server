import { Result } from "../../../domain/core/types/Result.js";
import { EventsService } from "../../../domain/events/EventsService.js";
import {CoreResponses} from '../../../domain/core/core.responses.js';
import { ActivityEvent, ActivityEventInstance, ActivityEventValues } from "../../../domain/activity/entities/ActivityEvent/ActivityEvent.model.js";
import { ActivityDatabase } from "../../../domain/activity/activity.database.js";
import { prepareQueryOperation } from "../../../domain/operations/prepareQueryOperation.js";
import { prepareUpdateOperation } from "../../../domain/operations/prepareUpdateOperation.js";
import { ActivityEvents, ActivityEventUpdatedEventPayload } from "../../../domain/activity/activity.events.js";
import { EntitySchemas } from "../../../domain/core/entities/Entity/Entity.schemas.js";
import { PartialDeep } from "type-fest";

export const UpdateActivityEventError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type UpdateActivityEventError = (typeof UpdateActivityEventError)[keyof typeof UpdateActivityEventError];

export async function updateActivityEvent(activityDatabase: ActivityDatabase, events: EventsService, activityEventId: string, activityEventValues: PartialDeep<ActivityEventValues>): Promise<Result<ActivityEventInstance, UpdateActivityEventError>> {
  const activityEventCandidate = new ActivityEvent(activityEventValues);

  if (!EntitySchemas.id.isValidSync(activityEventId) || !activityEventCandidate.isValidUpdateValue()) {
    return Result.fail(UpdateActivityEventError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<ActivityEventInstance>({id: activityEventId});
  const updateQuery = prepareUpdateOperation<ActivityEventInstance>(activityEventValues);

  const result = await activityDatabase.editActivityEvent(searchQuery, updateQuery);

  if (result.isFailure) {
    return Result.fail(UpdateActivityEventError.UNKNOWN);
  }

  events.emit<ActivityEventUpdatedEventPayload>(ActivityEvents.ACTIVITY_EVENT_UPDATED, result.success);

  return Result.ok(result.success);
}