import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {AuthenticationAuthProviderCreatedEventPayload, AuthenticationEvents} from '../../../domain/authentication/authentication.events.js';
import {
  BaseAuthProviderInstance,
  BaseAuthProviderValues,
} from '../../../domain/authentication/entities/AuthProvider/BaseAuthProvider.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {EventsService} from '../../../domain/events/EventsService.js';
import { AuthProviderFactory } from '../../../domain/authentication/entities/AuthProvider/AuthProvider.factory.js';

export const CreateAuthProviderError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
};
export type CreateAuthProviderError = (typeof CreateAuthProviderError)[keyof typeof CreateAuthProviderError];

export async function createAuthProvider<T extends BaseAuthProviderInstance, K extends BaseAuthProviderValues>(
  db: AuthenticationDatabase,
  eventsService: EventsService,
  authProvider: Partial<T> & K
): Promise<Result<BaseAuthProviderInstance, CreateAuthProviderError>> {
  const candidateResult = AuthProviderFactory.toCreate(authProvider);

  if (candidateResult.isFailure || !candidateResult.success.isValidCreateValue()) {
    return Result.fail(CreateAuthProviderError.INVALID_REQUEST);
  }

  const result = await db.addAuthProvider(authProvider);

  if (result.isFailure) {
    return Result.fail(CreateAuthProviderError.UNKNOWN);
  }

  eventsService.emit<AuthenticationAuthProviderCreatedEventPayload>(AuthenticationEvents.AUTHENTICATION_AUTH_PROVIDER_CREATED, result.success);

  return Result.ok(result.success);
}
