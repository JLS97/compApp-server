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

  /**
   * Cada inicio de sesión tiene su propio refresh token. Para invalidarlos todos a la vez (por ejemplo, al cambiar la contraseña) se buscan por authProviderId
   */
  const refreshTokenCreationResult = await authenticationService.createRefreshTokenForAuthProviderId(authProviderId, options.refreshTokenExpiresInMs);

  if (refreshTokenCreationResult.isFailure) {
    return Result.fail(refreshTokenCreationResult.failure);
  }

  const refreshTokenId = refreshTokenCreationResult.success.id;

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
