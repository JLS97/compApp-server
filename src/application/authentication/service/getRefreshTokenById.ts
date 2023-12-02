import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {RefreshTokenInstance} from '../../../domain/authentication/entities/RefreshToken/RefreshToken.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {prepareQueryOperation} from '../../../domain/operations/prepareQueryOperation.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export const GetRefreshTokenByIdError = {
  ...CoreResponses.InvalidRequest,
  ...AuthenticationResponses.RefreshTokenNotFound,
} as const;
export type GetRefreshTokenByIdError = (typeof GetRefreshTokenByIdError)[keyof typeof GetRefreshTokenByIdError];

export async function getRefreshTokenById(db: AuthenticationDatabase, refreshTokenId: string): Promise<Result<RefreshTokenInstance, GetRefreshTokenByIdError>> {
  if (!EntitySchemas.id.required().isValidSync(refreshTokenId)) {
    return Result.fail(GetRefreshTokenByIdError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<RefreshTokenInstance>({id: refreshTokenId});

  const refreshTokenResult = await db.findRefreshToken(searchQuery);

  if (refreshTokenResult.isFailure) {
    return Result.fail(GetRefreshTokenByIdError.AUTHENTICATION_REFRESH_TOKEN_NOT_FOUND);
  }

  return Result.ok(refreshTokenResult.success);
}
