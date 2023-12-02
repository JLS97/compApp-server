import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {BaseAuthProviderInstance} from '../../../domain/authentication/entities/AuthProvider/BaseAuthProvider.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import {prepareQueryOperation} from '../../../domain/operations/prepareQueryOperation.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export const GetAuthProviderByIdError = {
  ...CoreResponses.InvalidRequest,
  ...AuthenticationResponses.AuthProviderNotFound,
} as const;
export type GetAuthProviderByIdError = (typeof GetAuthProviderByIdError)[keyof typeof GetAuthProviderByIdError];

export async function getAuthProviderById(
  db: AuthenticationDatabase,
  authProviderId: string
): Promise<Result<BaseAuthProviderInstance, GetAuthProviderByIdError>> {
  if (!EntitySchemas.id.required().isValidSync(authProviderId)) {
    return Result.fail(GetAuthProviderByIdError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<BaseAuthProviderInstance>({id: authProviderId});

  const authProviderResult = await db.findAuthProvider(searchQuery);

  if (authProviderResult.isFailure) {
    return Result.fail(GetAuthProviderByIdError.AUTHENTICATION_AUTH_PROVIDER_NOT_FOUND);
  }

  return Result.ok(authProviderResult.success);
}
