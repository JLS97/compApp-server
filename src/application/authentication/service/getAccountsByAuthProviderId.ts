import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {BaseAccountInstance} from '../../../domain/authentication/entities/Account/BaseAccount.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {prepareQueryOperation} from '../../../domain/operations/prepareQueryOperation.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import {AuthenticationService} from '../authentication.service.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export const GetAccountsByAuthProviderIdError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
  ...AuthenticationResponses.AuthProviderNotFound,
} as const;
export type GetAccountsByAuthProviderIdError = (typeof GetAccountsByAuthProviderIdError)[keyof typeof GetAccountsByAuthProviderIdError];

export async function getAccountsByAuthProviderId(
  authenticationService: AuthenticationService,
  db: AuthenticationDatabase,
  authProviderId: string
): Promise<Result<BaseAccountInstance[], GetAccountsByAuthProviderIdError>> {
  if (!EntitySchemas.id.required().isValidSync(authProviderId)) {
    return Result.fail(GetAccountsByAuthProviderIdError.INVALID_REQUEST);
  }

  const authProviderResult = await authenticationService.getAuthProviderById(authProviderId);

  if (authProviderResult.isFailure) {
    return Result.fail(authProviderResult.failure);
  }

  const searchQuery = prepareQueryOperation<BaseAccountInstance>({providersId: [authProviderId]});

  const accountsResult = await db.findAccounts(searchQuery);

  if (accountsResult.isFailure) {
    return Result.fail(GetAccountsByAuthProviderIdError.UNKNOWN);
  }

  return Result.ok(accountsResult.success);
}
