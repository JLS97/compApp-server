import * as yup from 'yup';
import jwt from 'jsonwebtoken';
import {AuthenticationService} from '../authentication.service.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import {isAfter} from 'date-fns';
import {AccessTokenEncoded, AccessTokenPayload} from '../../../domain/authentication/types.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export interface CreateAccessTokenFromRefreshTokenOptions {
  expiresInMs: number;
  accessTokenSecret: string;
}

export const CreateAccessTokenFromRefreshTokenError = {
  ...CoreResponses.InvalidRequest,
  ...AuthenticationResponses.RefreshTokenNotFound,
  ...AuthenticationResponses.RefreshTokenExpired,
  ...AuthenticationResponses.RefreshTokenDisabled,
} as const;
export type CreateAccessTokenFromRefreshTokenError = (typeof CreateAccessTokenFromRefreshTokenError)[keyof typeof CreateAccessTokenFromRefreshTokenError];

export async function createAccessTokenFromRefreshToken(
  authenticationService: AuthenticationService,
  refreshTokenId: string,
  options: CreateAccessTokenFromRefreshTokenOptions
): Promise<Result<AccessTokenEncoded, CreateAccessTokenFromRefreshTokenError>> {
  const schema = yup.object().shape({
    refreshTokenId: EntitySchemas.id.required(),
    expiresInMs: yup.number().min(0).required(),
    accessTokenSecret: yup.string().min(0).required(),
  });

  if (!schema.isValidSync({refreshTokenId, ...options})) {
    return Result.fail(CreateAccessTokenFromRefreshTokenError.INVALID_REQUEST);
  }

  const refreshTokenResult = await authenticationService.getRefreshTokenById(refreshTokenId);

  if (refreshTokenResult.isFailure) {
    return Result.fail(refreshTokenResult.failure);
  }

  if (!refreshTokenResult.success.isValid) {
    return Result.fail(CreateAccessTokenFromRefreshTokenError.AUTHENTICATION_REFRESH_TOKEN_DISABLED);
  }

  const isRefreshTokenExpired = isAfter(new Date(Date.now()), refreshTokenResult.success.expiresAt);

  if (isRefreshTokenExpired) {
    return Result.fail(CreateAccessTokenFromRefreshTokenError.AUTHENTICATION_REFRESH_TOKEN_EXPIRED);
  }

  const accountsResult = await authenticationService.getAccountsByAuthProviderId(refreshTokenResult.success.authProviderId);

  if (accountsResult.isFailure) {
    return Result.fail(accountsResult.failure);
  }

  const accountIds = accountsResult.success.map((item) => item.id);

  const accessTokenPayload = {
    accountIds: accountIds,
    authProviderId: refreshTokenResult.success.authProviderId,
  } satisfies AccessTokenPayload;

  const accessToken = jwt.sign(accessTokenPayload, options.accessTokenSecret, {
    expiresIn: options.expiresInMs / 1000,
  });

  return Result.ok(accessToken as AccessTokenEncoded);
}
