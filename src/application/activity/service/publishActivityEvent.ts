import { Result } from "../../../domain/core/types/Result.js";
import {CoreResponses} from '../../../domain/core/core.responses.js';
import { EventsService } from "../../../domain/events/EventsService.js";
import { ActivityEvent, ActivityEventInstance, ActivityEventValues } from "../../../domain/activity/entities/ActivityEvent/ActivityEvent.model.js";
import { ActivityDatabase } from "../../../domain/activity/activity.database.js";
import { ActivityEvents, ActivityEventPublishedEventPayload } from "../../../domain/activity/activity.events.js";

export const PublishActivityEventError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type PublishActivityEventError = (typeof PublishActivityEventError)[keyof typeof PublishActivityEventError];

export async function publishActivityEvent(activityDatabase: ActivityDatabase, events: EventsService, activityEventValue: ActivityEventValues): Promise<Result<ActivityEventInstance, PublishActivityEventError>> {
  const activityEventCandidate = new ActivityEvent({...activityEventValue});

  if (!activityEventCandidate.isValidCreateValue()) {
    return Result.fail(PublishActivityEventError.INVALID_REQUEST);
  }

  const result = await activityDatabase.addActivityEvent(activityEventValue);

  if (result.isFailure) {
    return Result.fail(PublishActivityEventError.UNKNOWN);
  }

  events.emit<ActivityEventPublishedEventPayload>(ActivityEvents.ACTIVITY_EVENT_PUBLISHED, result.success);

  return Result.ok(result.success);
}