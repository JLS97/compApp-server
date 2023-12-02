import * as yup from 'yup';
import { Result } from "../../../domain/core/types/Result.js";
import { CoreResponses } from "../../../domain/core/core.responses.js";
import { EventsService } from "../../../domain/events/EventsService.js";
import { SocialDatabase } from "../../../domain/social/social.database.js";
import { FollowingRelationshipSchemas } from '../../../domain/social/entities/FollowingRelationship/FollowingRelationship.schemas.js';
import { FollowingRelationshipInstance } from '../../../domain/social/entities/FollowingRelationship/FollowingRelationship.model.js';
import { SocialEvents, SocialFollowingRelationshipCreatedEventPayload } from '../../../domain/social/social.events.js';

export const CreateFollowingRelationshipError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type CreateFollowingRelationshipError = typeof CreateFollowingRelationshipError[keyof typeof CreateFollowingRelationshipError];

export async function createFollowingRelationship(database: SocialDatabase, events: EventsService, followerId: string, followedId: string): Promise<Result<FollowingRelationshipInstance, CreateFollowingRelationshipError>>{
  const schema = yup.object().shape({
    followerId: FollowingRelationshipSchemas.followerId.required(),
    followedId: FollowingRelationshipSchemas.followedId.required(),
  });

  if(!schema.isValidSync({followerId, followedId})){
    return Result.fail(CreateFollowingRelationshipError.INVALID_REQUEST);
  }

  const result = await database.addFollowingRelationship({
    followedId,
    followerId,
  });

  if(result.isFailure){
    return Result.fail(CreateFollowingRelationshipError.UNKNOWN);
  }

  events.emit<SocialFollowingRelationshipCreatedEventPayload>(SocialEvents.SOCIAL_FOLLOWING_RELATIONSHIP_CREATED, result.success);

  return Result.ok(result.success);
}