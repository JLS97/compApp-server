import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {BaseAccountInstance} from '../../../domain/authentication/entities/Account/BaseAccount.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {prepareQueryOperation} from '../../../domain/operations/prepareQueryOperation.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export const GetAccountByIdError = {
  ...CoreResponses.InvalidRequest,
  ...AuthenticationResponses.AccountNotFound,
} as const;
export type GetAccountByIdError = (typeof GetAccountByIdError)[keyof typeof GetAccountByIdError];

export async function getAccountById(authenticationDatabase: AuthenticationDatabase, accountId: string): Promise<Result<BaseAccountInstance, GetAccountByIdError>> {
  if (!EntitySchemas.id.required().isValidSync(accountId)) {
    return Result.fail(GetAccountByIdError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<BaseAccountInstance>({id: accountId});

  const result = await authenticationDatabase.findAccount(searchQuery);

  if (result.isFailure) {
    return Result.fail(GetAccountByIdError.AUTHENTICATION_ACCOUNT_NOT_FOUND);
  }

  return Result.ok(result.success);
}
