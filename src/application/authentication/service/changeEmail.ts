import * as yup from 'yup';
import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {EmailAuthProviderInstance} from '../../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import {AuthenticationService} from '../authentication.service.js';
import {EmailAuthProviderSchema} from '../../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.schemas.js';
import {EventsService} from '../../../domain/events/EventsService.js';
import {AuthenticationAuthProviderChangedEmailEventPayload, AuthenticationEvents} from '../../../domain/authentication/authentication.events.js';
import {prepareQueryOperation} from '../../../domain/operations/prepareQueryOperation.js';
import {prepareUpdateOperation} from '../../../domain/operations/prepareUpdateOperation.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export const ChangeEmailError = {
  ...CoreResponses.InvalidRequest,
  ...AuthenticationResponses.AuthProviderNotFound,
  ...AuthenticationResponses.AuthProviderWrongProvider,
  ...AuthenticationResponses.AuthProviderDuplicatedEmail,
} as const;
export type ChangeEmailError = (typeof ChangeEmailError)[keyof typeof ChangeEmailError];

export async function changeEmail(
  authenticationService: AuthenticationService,
  db: AuthenticationDatabase,
  eventsService: EventsService,
  authProviderId: string,
  newEmail: string
): Promise<Result<EmailAuthProviderInstance, ChangeEmailError>> {
  const schema = yup.object().shape({
    authProviderId: EntitySchemas.id.required(),
    newEmail: EmailAuthProviderSchema.email.required(),
  });

  if (!schema.isValidSync({authProviderId, newEmail})) {
    return Result.fail(ChangeEmailError.INVALID_REQUEST);
  }

  const authProviderResult = await authenticationService.getAuthProviderById(authProviderId);

  if (authProviderResult.isFailure) {
    return Result.fail(ChangeEmailError.AUTHENTICATION_AUTH_PROVIDER_NOT_FOUND);
  }

  if (authProviderResult.success.type !== 'EMAIL') {
    return Result.fail(ChangeEmailError.AUTHENTICATION_AUTH_PROVIDER_WRONG_PROVIDER);
  }

  const checkForEmailResult = await authenticationService.getAuthProviderByEmail(newEmail, 'EMAIL');

  if (checkForEmailResult.isSuccess) {
    return Result.fail(ChangeEmailError.AUTHENTICATION_AUTH_PROVIDER_DUPLICATED_EMAIL);
  }

  const searchQuery = prepareQueryOperation<EmailAuthProviderInstance>({id: authProviderResult.success.id});
  const updateQuery = prepareUpdateOperation<EmailAuthProviderInstance>({email: newEmail});

  const updatedAuthProviderResult = await db.editAuthProvider(searchQuery, updateQuery);

  if (updatedAuthProviderResult.isFailure) {
    return Result.fail(ChangeEmailError.AUTHENTICATION_AUTH_PROVIDER_NOT_FOUND);
  }

  const updatedEmailAuthProvider = updatedAuthProviderResult.success as EmailAuthProviderInstance;

  eventsService.emit<AuthenticationAuthProviderChangedEmailEventPayload>(
    AuthenticationEvents.AUTHENTICATION_AUTH_PROVIDER_CHANGED_EMAIL,
    updatedEmailAuthProvider
  );

  return Result.ok(updatedEmailAuthProvider);
}
