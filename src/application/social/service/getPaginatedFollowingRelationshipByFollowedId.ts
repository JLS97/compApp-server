import * as yup from 'yup';
import { Paginated } from "../../../domain/core/types/Paginated.js";
import { Result } from "../../../domain/core/types/Result.js";
import { CoreResponses } from "../../../domain/core/core.responses.js";
import { FollowingRelationshipInstance } from "../../../domain/social/entities/FollowingRelationship/FollowingRelationship.model.js";
import { SocialDatabase } from "../../../domain/social/social.database.js";
import { FollowingRelationshipSchemas } from '../../../domain/social/entities/FollowingRelationship/FollowingRelationship.schemas.js';
import { CoreSchemas } from '../../../domain/core/core.schemas.js';
import { prepareQueryOperation } from '../../../domain/operations/prepareQueryOperation.js';

export const GetPaginatedFollowingRelationshipByFollowedIdError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type GetPaginatedFollowingRelationshipByFollowedIdError = typeof GetPaginatedFollowingRelationshipByFollowedIdError[keyof typeof GetPaginatedFollowingRelationshipByFollowedIdError];

export async function getPaginatedFollowingRelationshipByFollowedId(database: SocialDatabase, followedId: string, page: number, pageSize: number): Promise<Result<Paginated<FollowingRelationshipInstance>, GetPaginatedFollowingRelationshipByFollowedIdError>>{

  const schema = yup.object().shape({
    followedId: FollowingRelationshipSchemas.followedId.required(),
    page: CoreSchemas.page.required(),
    pageSize: CoreSchemas.pageSize.required(),
  });

  if(!schema.isValidSync({followedId, page, pageSize})){
    return Result.fail(GetPaginatedFollowingRelationshipByFollowedIdError.INVALID_REQUEST);
  }

  const query = prepareQueryOperation<FollowingRelationshipInstance>({
    followedId,
  })


  const result = await database.findFollowingRelationshipsPaginated(query, page, pageSize);

  if(result.isFailure){
    return Result.fail(GetPaginatedFollowingRelationshipByFollowedIdError.UNKNOWN);
  }

  return Result.ok(result.success);
}