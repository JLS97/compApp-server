import * as yup from 'yup';
import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {BaseAuthProviderInstance} from '../../../domain/authentication/entities/AuthProvider/BaseAuthProvider.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import {prepareQueryOperation} from '../../../domain/operations/prepareQueryOperation.js';

export const GetAuthProviderByEmailError = {
  ...CoreResponses.InvalidRequest,
  ...AuthenticationResponses.AuthProviderEmailNotFound,
} as const;
export type GetAuthProviderByEmailError = (typeof GetAuthProviderByEmailError)[keyof typeof GetAuthProviderByEmailError];

export async function getAuthProviderByEmail(
  db: AuthenticationDatabase,
  email: string,
  type: string
): Promise<Result<BaseAuthProviderInstance, GetAuthProviderByEmailError>> {
  const schema = yup.object().shape({
    email: yup.string().required(),
    type: yup.string().required(),
  });

  if (!schema.isValidSync({email, type})) {
    return Result.fail(GetAuthProviderByEmailError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<BaseAuthProviderInstance & {email: string}>({email, type});

  const authProviderResult = await db.findAuthProvider<BaseAuthProviderInstance & {email: string}>(searchQuery);

  if (authProviderResult.isFailure) {
    return Result.fail(GetAuthProviderByEmailError.AUTHENTICATION_AUTH_PROVIDER_EMAIL_NOT_FOUND);
  }

  return Result.ok(authProviderResult.success);
}
