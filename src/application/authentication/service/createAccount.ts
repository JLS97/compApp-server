import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {AuthenticationAccountCreatedEventPayload, AuthenticationEvents} from '../../../domain/authentication/authentication.events.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {EventsService} from '../../../domain/events/EventsService.js';
import { AccountFactory } from '../../../domain/authentication/entities/Account/Account.factory.js';
import { BaseAccountInstance, BaseAccountValues } from '../../../domain/authentication/entities/Account/BaseAccount.model.js';

export const CreateAccountError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type CreateAccountError = (typeof CreateAccountError)[keyof typeof CreateAccountError];

export async function createAccount(
  authenticationDatabase: AuthenticationDatabase,
  events: EventsService,
  account: Partial<BaseAccountInstance> & BaseAccountValues
): Promise<Result<BaseAccountInstance, CreateAccountError>> {
  const accountCandidate = AccountFactory.toCreate(account);
  
  if (accountCandidate.isFailure || !accountCandidate.success.isValidCreateValue()) {
    return Result.fail(CreateAccountError.INVALID_REQUEST);
  }

  const result = await authenticationDatabase.addAccount(accountCandidate.success.values());

  if (result.isFailure) {
    return Result.fail(CreateAccountError.UNKNOWN);
  }

  events.emit<AuthenticationAccountCreatedEventPayload>(AuthenticationEvents.AUTHENTICATION_ACCOUNT_CREATED, result.success);

  return Result.ok(result.success);
}
