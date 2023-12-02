import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {AuthenticationEvents, AuthenticationLinkedProviderEventPayload} from '../../../domain/authentication/authentication.events.js';
import {BaseAccountInstance} from '../../../domain/authentication/entities/Account/BaseAccount.model.js';
import {
  BaseAuthProvider,
  BaseAuthProviderInstance,
  BaseAuthProviderValues,
} from '../../../domain/authentication/entities/AuthProvider/BaseAuthProvider.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {EventsService} from '../../../domain/events/EventsService.js';
import {prepareQueryOperation} from '../../../domain/operations/prepareQueryOperation.js';
import {prepareUpdateOperation} from '../../../domain/operations/prepareUpdateOperation.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import {AuthenticationService} from '../authentication.service.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';
import { UpdateOperations } from '../../../domain/operations/UpdateOperations.js';
import { Operation } from '../../../domain/operations/types.js';

export const AddProviderToAccountError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
  ...AuthenticationResponses.AuthProviderNotFound,
} as const;
export type AddProviderToAccountError = (typeof AddProviderToAccountError)[keyof typeof AddProviderToAccountError];

export async function addProviderToAccount(
  authenticationService: AuthenticationService,
  authenticationDatabase: AuthenticationDatabase,
  events: EventsService,
  accountId: string,
  provider: Partial<BaseAuthProviderInstance> & BaseAuthProviderValues
): Promise<Result<BaseAccountInstance, AddProviderToAccountError>> {
  if (!EntitySchemas.id.isValidSync(accountId) || !BaseAuthProvider._createValueSchema.isValidSync(provider)) {
    return Result.fail(AddProviderToAccountError.INVALID_REQUEST);
  }

  let providerToLink: BaseAuthProviderInstance;
  if (!provider.id) {
    const createProviderResult = await authenticationDatabase.addAuthProvider(provider);
    if (createProviderResult.isFailure) {
      return Result.fail(AddProviderToAccountError.UNKNOWN);
    }

    providerToLink = createProviderResult.success;
  } else {
    const retrieveProviderResult = await authenticationService.getAuthProviderById(provider.id);
    if (retrieveProviderResult.isFailure) {
      return Result.fail(AddProviderToAccountError.AUTHENTICATION_AUTH_PROVIDER_NOT_FOUND);
    }

    providerToLink = retrieveProviderResult.success;
  }

  const searchQuery = prepareQueryOperation<BaseAccountInstance>({id: accountId});
  const updateQuery = prepareUpdateOperation<Omit<BaseAccountInstance, "providersId"> & {providersId: Operation}>({providersId: UpdateOperations.push(providerToLink.id)});

  const updatedAccountResult = await authenticationDatabase.editAccount(searchQuery, updateQuery);

  if (updatedAccountResult.isFailure) {
    return Result.fail(AddProviderToAccountError.UNKNOWN);
  }

  events.emit<AuthenticationLinkedProviderEventPayload>(AuthenticationEvents.AUTHENTICATION_LINKED_PROVIDER, {
    account: updatedAccountResult.success,
    provider: providerToLink,
  });

  return Result.ok(updatedAccountResult.success);
}
