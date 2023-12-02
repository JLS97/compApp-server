import * as yup from 'yup';
import { Result } from "../../../domain/core/types/Result.js";
import { CoreResponses } from "../../../domain/core/core.responses.js";
import { SocialDatabase } from "../../../domain/social/social.database.js";
import { FollowingRelationshipSchemas } from '../../../domain/social/entities/FollowingRelationship/FollowingRelationship.schemas.js';
import { prepareQueryOperation } from '../../../domain/operations/prepareQueryOperation.js';
import { FollowingStatus } from '../../../domain/social/types.js';
import { FollowingRelationshipInstance } from '../../../domain/social/entities/FollowingRelationship/FollowingRelationship.model.js';

export const GetFollowingRelationshipStatusError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type GetFollowingRelationshipStatusError = typeof GetFollowingRelationshipStatusError[keyof typeof GetFollowingRelationshipStatusError];

export async function getFollowingRelationshipStatus(database: SocialDatabase, followerId: string, followedId: string): Promise<Result<FollowingStatus, GetFollowingRelationshipStatusError>>{

  const schema = yup.object().shape({
    followerId: FollowingRelationshipSchemas.followerId.required(),
    followedId: FollowingRelationshipSchemas.followedId.required(),
  });

  if(!schema.isValidSync({followerId, followedId})){
    return Result.fail(GetFollowingRelationshipStatusError.INVALID_REQUEST);
  }

  const query = prepareQueryOperation<FollowingRelationshipInstance>({
    followerId,
    followedId,
  })


  const result = await database.findFollowingRelationship(query);

  if(result.isFailure){
    return Result.ok(FollowingStatus.NOT_FOLLOWING);
  }

  return Result.ok(FollowingStatus.FOLLOWING);
}