import * as yup from 'yup';
import { Result } from "../../../domain/core/types/Result.js";
import { CoreResponses } from "../../../domain/core/core.responses.js";
import { EventsService } from "../../../domain/events/EventsService.js";
import { FollowingRelationshipInstance } from "../../../domain/social/entities/FollowingRelationship/FollowingRelationship.model.js";
import { SocialDatabase } from "../../../domain/social/social.database.js";
import { FollowingRelationshipSchemas } from '../../../domain/social/entities/FollowingRelationship/FollowingRelationship.schemas.js';
import { prepareQueryOperation } from '../../../domain/operations/prepareQueryOperation.js';
import { SocialEvents, SocialFollowingRelationshipRemovedEventPayload } from '../../../domain/social/social.events.js';

export const DeleteFollowingRelationshipError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type DeleteFollowingRelationshipError = typeof DeleteFollowingRelationshipError[keyof typeof DeleteFollowingRelationshipError];

export async function deleteFollowingRelationship(database: SocialDatabase, events: EventsService, followerId: string, followedId: string): Promise<Result<FollowingRelationshipInstance, DeleteFollowingRelationshipError>>{
  const schema = yup.object().shape({
    followerId: FollowingRelationshipSchemas.followerId.required(),
    followedId: FollowingRelationshipSchemas.followedId.required(),
  });

  if(!schema.isValidSync({followerId, followedId})){
    return Result.fail(DeleteFollowingRelationshipError.INVALID_REQUEST);
  }

  const query = prepareQueryOperation<FollowingRelationshipInstance>({
    followerId,
    followedId,
  })

  const result = await database.removeFollowingRelationship(query);

  if(result.isFailure){
    return Result.fail(DeleteFollowingRelationshipError.UNKNOWN);
  }

  events.emit<SocialFollowingRelationshipRemovedEventPayload>(SocialEvents.SOCIAL_FOLLOWING_RELATIONSHIP_REMOVED, result.success);

  return Result.ok(result.success);
}