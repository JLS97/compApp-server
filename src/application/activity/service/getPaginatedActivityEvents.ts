import * as yup from 'yup';
import { Paginated } from "../../../domain/core/types/Paginated.js";
import { Result } from "../../../domain/core/types/Result.js";
import {CoreResponses} from '../../../domain/core/core.responses.js';
import { ActivityEventInstance } from "../../../domain/activity/entities/ActivityEvent/ActivityEvent.model.js";
import { ActivityEventSchemas } from "../../../domain/activity/entities/ActivityEvent/ActivityEvent.schemas.js";
import { ActivityDatabase } from "../../../domain/activity/activity.database.js";
import { prepareQueryOperation } from '../../../domain/operations/prepareQueryOperation.js';
import { CoreSchemas } from '../../../domain/core/core.schemas.js';

export const GetPaginatedActivityEventsError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type GetPaginatedActivityEventsError = (typeof GetPaginatedActivityEventsError)[keyof typeof GetPaginatedActivityEventsError];

export async function getPaginatedActivityEvents(activityDatabase: ActivityDatabase, receiverId: string, page: number, pageSize: number): Promise<Result<Paginated<ActivityEventInstance>, GetPaginatedActivityEventsError>> {
  const schema = yup.object().shape({
    receiverId: ActivityEventSchemas.receiverId.required(),
    page: CoreSchemas.page.required(),
    pageSize: CoreSchemas.pageSize.required(),
  });

  if (!schema.isValidSync({receiverId, page, pageSize})) {
    return Result.fail(GetPaginatedActivityEventsError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<ActivityEventInstance>({receiverId});

  const result = await activityDatabase.findActivityEventsPaginated(searchQuery, page, pageSize);

  if (result.isFailure) {
    return Result.fail(GetPaginatedActivityEventsError.UNKNOWN);
  }

  return Result.ok(result.success);
}