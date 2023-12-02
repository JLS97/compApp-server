import * as yup from 'yup';
import {AccessCredentials} from '../../../domain/authentication/types.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import {AuthenticationService} from '../authentication.service.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export interface GenerateCredentialsOptions {
  refreshTokenExpiresInMs: number;
  accessTokenExpiresInMs: number;
  accessTokenSecret: string;
}

export const GenerateCredentialsError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
  ...AuthenticationResponses.RefreshTokenNotFound,
  ...AuthenticationResponses.AuthProviderNotFound,
} as const;
export type GenerateCredentialsError = (typeof GenerateCredentialsError)[keyof typeof GenerateCredentialsError];

export async function generateCredentials(
  authenticationService: AuthenticationService,
  authProviderId: string,
  options: GenerateCredentialsOptions
): Promise<Result<AccessCredentials, GenerateCredentialsError>> {
  const schema = yup.object().shape({
    authProviderId: EntitySchemas.id.required(),
    refreshTokenExpiresInMs: yup.number().min(0),
    accessTokenExpiresInMs: yup.number().min(0),
  });

  if (!schema.isValidSync({authProviderId, ...options})) {
    return Result.fail(GenerateCredentialsError.INVALID_REQUEST);
  }

  const existingRefreshTokenResult = await authenticationService.getRefreshTokenById(authProviderId);

  let refreshTokenId: string;

  /**
   * Para poder invalidar los refresh token, primero intentamos utilizar uno existente. Si no existe, se crea
   */
  if (existingRefreshTokenResult.isFailure) {
    const refreshTokenCreationResult = await authenticationService.createRefreshTokenForAuthProviderId(authProviderId, options.refreshTokenExpiresInMs);

    if (refreshTokenCreationResult.isFailure) {
      return Result.fail(refreshTokenCreationResult.failure);
    }

    refreshTokenId = refreshTokenCreationResult.success.id;
  } else {
    refreshTokenId = existingRefreshTokenResult.success.id;
  }

  const createAccessTokenResult = await authenticationService.createAccessTokenFromRefreshToken(refreshTokenId, {
    accessTokenSecret: options.accessTokenSecret,
    expiresInMs: options.accessTokenExpiresInMs,
  });

  if (createAccessTokenResult.isFailure) {
    return Result.fail(createAccessTokenResult.failure);
  }

  return Result.ok({
    accessToken: createAccessTokenResult.success,
    refreshToken: refreshTokenId,
  });
}
