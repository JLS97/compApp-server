import * as yup from 'yup';
import { Result } from "../../../domain/core/types/Result.js";
import {CoreResponses} from '../../../domain/core/core.responses.js';
import { ActivityEventSchemas } from "../../../domain/activity/entities/ActivityEvent/ActivityEvent.schemas.js";
import { ActivityDatabase } from "../../../domain/activity/activity.database.js";
import { prepareQueryOperation } from '../../../domain/operations/prepareQueryOperation.js';
import { ActivityEventInstance } from '../../../domain/activity/entities/ActivityEvent/ActivityEvent.model.js';

export const GetTotalUnreadError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type GetTotalUnreadError = (typeof GetTotalUnreadError)[keyof typeof GetTotalUnreadError];

export async function getTotalUnread(activityDatabase: ActivityDatabase, receiverId: string): Promise<Result<number, GetTotalUnreadError>> {
  const schema = yup.object().shape({
    receiverId: ActivityEventSchemas.receiverId.required(),
  });

  if (!schema.isValidSync({receiverId})) {
    return Result.fail(GetTotalUnreadError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<ActivityEventInstance>({receiverId});

  const result = await activityDatabase.estimateActivityEvents(searchQuery);

  if (result.isFailure) {
    return Result.fail(GetTotalUnreadError.UNKNOWN);
  }

  return Result.ok(result.success);
}