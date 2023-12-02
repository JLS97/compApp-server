import { AuthenticationDatabase } from "../../../domain/authentication/authentication.database.js";
import { FacebookAuthProviderInstance } from "../../../domain/authentication/entities/AuthProvider/FacebookAuthProvider/FacebookAuthProvider.model.js";
import { Result } from "../../../domain/core/types/Result.js";
import {CoreResponses} from '../../../domain/core/core.responses.js'
import {AuthenticationResponses} from '../../../application/authentication/authentication.responses.js'
import { FacebookAuthProviderSchema } from "../../../domain/authentication/entities/AuthProvider/FacebookAuthProvider/FacebookAuthProvider.schemas.js";
import { prepareQueryOperation } from "../../../domain/operations/prepareQueryOperation.js";
import { AuthProviderType } from "../../../domain/authentication/entities/AuthProvider/types.js";

export const GetFacebookAuthProviderByProfileIdError = {
  ...CoreResponses.InvalidRequest,
  ...AuthenticationResponses.AuthProviderNotFound,
} as const;
export type GetFacebookAuthProviderByProfileIdError = typeof GetFacebookAuthProviderByProfileIdError[keyof typeof GetFacebookAuthProviderByProfileIdError];

export async function getFacebookAuthProviderByProfileId(db:AuthenticationDatabase, profileId: string): Promise<Result<FacebookAuthProviderInstance, GetFacebookAuthProviderByProfileIdError>> {
  if (!FacebookAuthProviderSchema.profileId.required().isValidSync(profileId)) {
    return Result.fail(GetFacebookAuthProviderByProfileIdError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<FacebookAuthProviderInstance>({type: AuthProviderType.FACEBOOK, profileId: profileId});

  const authProviderResult = await db.findAuthProvider(searchQuery);

  if (authProviderResult.isFailure) {
    return Result.fail(GetFacebookAuthProviderByProfileIdError.AUTHENTICATION_AUTH_PROVIDER_NOT_FOUND);
  }

  return Result.ok(authProviderResult.success as FacebookAuthProviderInstance);
}