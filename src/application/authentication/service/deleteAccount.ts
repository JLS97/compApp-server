import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {AuthenticationAccountRemovedEventPayload, AuthenticationEvents} from '../../../domain/authentication/authentication.events.js';
import {BaseAccountInstance} from '../../../domain/authentication/entities/Account/BaseAccount.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {EventsService} from '../../../domain/events/EventsService.js';
import {prepareQueryOperation} from '../../../domain/operations/prepareQueryOperation.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export const DeleteAccountError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
  ...AuthenticationResponses.AccountNotFound,
} as const;
export type DeleteAccountError = (typeof DeleteAccountError)[keyof typeof DeleteAccountError];

export async function deleteAccount(
  authenticationDatabase: AuthenticationDatabase,
  events: EventsService,
  accountId: string
): Promise<Result<BaseAccountInstance, DeleteAccountError>> {
  if (!EntitySchemas.id.required().isValidSync(accountId)) {
    return Result.fail(DeleteAccountError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<BaseAccountInstance>({id: accountId});

  const result = await authenticationDatabase.removeAccount(searchQuery);

  if (result.isFailure) {
    return Result.fail(DeleteAccountError.AUTHENTICATION_ACCOUNT_NOT_FOUND);
  }

  events.emit<AuthenticationAccountRemovedEventPayload>(AuthenticationEvents.AUTHENTICATION_ACCOUNT_REMOVED, result.success);

  return Result.ok(result.success);
}
