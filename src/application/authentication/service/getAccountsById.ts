import * as yup from 'yup';
import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {BaseAccountInstance} from '../../../domain/authentication/entities/Account/BaseAccount.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {prepareQueryOperation} from '../../../domain/operations/prepareQueryOperation.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export const GetAccountsByIdError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type GetAccountsByIdError = (typeof GetAccountsByIdError)[keyof typeof GetAccountsByIdError];

export async function getAccountsById(
  authenticationDatabase: AuthenticationDatabase,
  accountIds: string[]
): Promise<Result<BaseAccountInstance[], GetAccountsByIdError>> {
  if (!yup.array().of(EntitySchemas.id.required()).isValidSync(accountIds)) {
    return Result.fail(GetAccountsByIdError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation({id: accountIds});

  const result = await authenticationDatabase.findAccounts(searchQuery);

  if (result.isFailure) {
    return Result.fail(GetAccountsByIdError.UNKNOWN);
  }

  return Result.ok(result.success);
}
