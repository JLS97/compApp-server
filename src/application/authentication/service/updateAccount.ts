import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {AuthenticationAccountUpdatedEventPayload, AuthenticationEvents} from '../../../domain/authentication/authentication.events.js';
import {BaseAccountInstance, BaseAccountValues} from '../../../domain/authentication/entities/Account/BaseAccount.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {EventsService} from '../../../domain/events/EventsService.js';
import {prepareQueryOperation} from '../../../domain/operations/prepareQueryOperation.js';
import {prepareUpdateOperation} from '../../../domain/operations/prepareUpdateOperation.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';
import { PartialDeep } from 'type-fest';
import { AccountFactory } from '../../../domain/authentication/entities/Account/Account.factory.js';

export const UpdateAccountError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type UpdateAccountError = (typeof UpdateAccountError)[keyof typeof UpdateAccountError];

export async function updateAccount(
  authenticationDatabase: AuthenticationDatabase,
  events: EventsService,
  accountId: string,
  accountValues: PartialDeep<BaseAccountValues> & {type: BaseAccountValues["type"]},
): Promise<Result<BaseAccountInstance, UpdateAccountError>> {
  const accountCandidate = AccountFactory.toUpdate(accountValues);

  if (!EntitySchemas.id.isValidSync(accountId) || accountCandidate.isFailure || !accountCandidate.success.isValidUpdateValue()) {
    return Result.fail(UpdateAccountError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation({id: accountId});
  const updateQuery = prepareUpdateOperation(accountValues);

  const result = await authenticationDatabase.editAccount<BaseAccountInstance>(searchQuery, updateQuery);

  if (result.isFailure) {
    return Result.fail(UpdateAccountError.UNKNOWN);
  }

  events.emit<AuthenticationAccountUpdatedEventPayload>(AuthenticationEvents.AUTHENTICATION_ACCOUNT_UPDATED, result.success);

  return Result.ok(result.success);
}
