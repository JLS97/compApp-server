import * as yup from 'yup';
import { Paginated } from "../../../domain/core/types/Paginated.js";
import { Result } from "../../../domain/core/types/Result.js";
import { CoreResponses } from "../../../domain/core/core.responses.js";
import { FollowingRelationshipInstance } from "../../../domain/social/entities/FollowingRelationship/FollowingRelationship.model.js";
import { SocialDatabase } from "../../../domain/social/social.database.js";
import { FollowingRelationshipSchemas } from '../../../domain/social/entities/FollowingRelationship/FollowingRelationship.schemas.js';
import { CoreSchemas } from '../../../domain/core/core.schemas.js';
import { prepareQueryOperation } from '../../../domain/operations/prepareQueryOperation.js';

export const GetPaginatedFollowingRelationshipByFollowerIdError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type GetPaginatedFollowingRelationshipByFollowerIdError = typeof GetPaginatedFollowingRelationshipByFollowerIdError[keyof typeof GetPaginatedFollowingRelationshipByFollowerIdError];

export async function getPaginatedFollowingRelationshipByFollowerId(database: SocialDatabase, followerId: string, page: number, pageSize: number): Promise<Result<Paginated<FollowingRelationshipInstance>, GetPaginatedFollowingRelationshipByFollowerIdError>>{

  const schema = yup.object().shape({
    followerId: FollowingRelationshipSchemas.followerId.required(),
    page: CoreSchemas.page.required(),
    pageSize: CoreSchemas.pageSize.required(),
  });

  if(!schema.isValidSync({followerId, page, pageSize})){
    return Result.fail(GetPaginatedFollowingRelationshipByFollowerIdError.INVALID_REQUEST);
  }

  const query = prepareQueryOperation<FollowingRelationshipInstance>({
    followerId,
  })


  const result = await database.findFollowingRelationshipsPaginated(query, page, pageSize);

  if(result.isFailure){
    return Result.fail(GetPaginatedFollowingRelationshipByFollowerIdError.UNKNOWN);
  }

  return Result.ok(result.success);
}