import * as yup from 'yup';
import {nanoid} from 'nanoid';
import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {RefreshTokenInstance} from '../../../domain/authentication/entities/RefreshToken/RefreshToken.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import {addMilliseconds} from 'date-fns';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export const CreateRefreshTokenForAuthProviderIdError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
  ...AuthenticationResponses.AuthProviderNotFound,
} as const;
export type CreateRefreshTokenForAuthProviderIdError = (typeof CreateRefreshTokenForAuthProviderIdError)[keyof typeof CreateRefreshTokenForAuthProviderIdError];

export async function createRefreshTokenForAuthProviderId(
  db: AuthenticationDatabase,
  authProviderId: string,
  expiresInMs: number
): Promise<Result<RefreshTokenInstance, CreateRefreshTokenForAuthProviderIdError>> {
  const schema = yup.object().shape({
    authProviderId: EntitySchemas.id.required(),
    expiresInMs: yup.number().min(0).required(),
  });

  if (!schema.isValidSync({authProviderId, expiresInMs})) {
    return Result.fail(CreateRefreshTokenForAuthProviderIdError.INVALID_REQUEST);
  }

  const JWT_REFRESH_TOKEN_LENGTH = 64;
  const refreshTokenId = nanoid(JWT_REFRESH_TOKEN_LENGTH);
  const refreshTokenExpirationDate = addMilliseconds(new Date(Date.now()), expiresInMs);

  const createdRefreshTokenResult = await db.addRefreshToken({id: refreshTokenId, authProviderId, isValid: true, expiresAt: refreshTokenExpirationDate});

  if (createdRefreshTokenResult.isFailure) {
    return Result.fail(CreateRefreshTokenForAuthProviderIdError.UNKNOWN);
  }

  return Result.ok(createdRefreshTokenResult.success);
}
