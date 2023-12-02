import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {AuthenticationEvents, AuthenticationUnlinkedProviderEventPayload} from '../../../domain/authentication/authentication.events.js';
import {BaseAccountInstance} from '../../../domain/authentication/entities/Account/BaseAccount.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {EventsService} from '../../../domain/events/EventsService.js';
import {prepareQueryOperation} from '../../../domain/operations/prepareQueryOperation.js';
import {prepareUpdateOperation} from '../../../domain/operations/prepareUpdateOperation.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';
import { UpdateOperations } from '../../../domain/operations/UpdateOperations.js';
import { Operation } from '../../../domain/operations/types.js';

export const RemoveProviderFromAccountError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type RemoveProviderFromAccountError = (typeof RemoveProviderFromAccountError)[keyof typeof RemoveProviderFromAccountError];

export async function removeProviderFromAccount(
  authenticationDatabase: AuthenticationDatabase,
  events: EventsService,
  accountId: string,
  providerId: string
): Promise<Result<BaseAccountInstance, RemoveProviderFromAccountError>> {
  if (!EntitySchemas.id.isValidSync(accountId) || !EntitySchemas.id.isValidSync(providerId)) {
    return Result.fail(RemoveProviderFromAccountError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<BaseAccountInstance>({id: accountId});

  const updateQuery = prepareUpdateOperation<Omit<BaseAccountInstance, "providersId"> & {providersId: Operation}>({providersId: UpdateOperations.pull(providerId)});

  const updatedAccountResult = await authenticationDatabase.editAccount(searchQuery, updateQuery);

  if (updatedAccountResult.isFailure) {
    return Result.fail(RemoveProviderFromAccountError.UNKNOWN);
  }

  events.emit<AuthenticationUnlinkedProviderEventPayload>(AuthenticationEvents.AUTHENTICATION_UNLINKED_PROVIDER, {
    account: updatedAccountResult.success,
    providerId: providerId,
  });

  return Result.ok(updatedAccountResult.success);
}
