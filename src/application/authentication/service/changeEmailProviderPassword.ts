import * as yup from 'yup';
import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {EmailAuthProviderInstance} from '../../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {EventsService} from '../../../domain/events/EventsService.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import {AuthenticationService} from '../authentication.service.js';
import {EmailAuthProviderSchema} from '../../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.schemas.js';
import {AuthenticationAuthProviderChangedPasswordEventPayload, AuthenticationEvents} from '../../../domain/authentication/authentication.events.js';
import {prepareQueryOperation} from '../../../domain/operations/prepareQueryOperation.js';
import {prepareUpdateOperation} from '../../../domain/operations/prepareUpdateOperation.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export const ChangeEmailProviderPasswordError = {
  ...CoreResponses.InvalidRequest,
  ...AuthenticationResponses.AuthProviderNotFound,
  ...AuthenticationResponses.AuthProviderWrongPassword,
  ...AuthenticationResponses.AuthProviderWrongProvider,
} as const;
export type ChangeEmailProviderPasswordError = (typeof ChangeEmailProviderPasswordError)[keyof typeof ChangeEmailProviderPasswordError];

export async function changeEmailProviderPassword(
  authenticationService: AuthenticationService,
  db: AuthenticationDatabase,
  eventsService: EventsService,
  authProviderId: string,
  oldPassword: string,
  newPassword: string
): Promise<Result<EmailAuthProviderInstance, ChangeEmailProviderPasswordError>> {
  const schema = yup.object().shape({
    authProviderId: EntitySchemas.id.required(),
    oldPassword: yup.string().required(),
    newPassword: EmailAuthProviderSchema.password.required(),
  });

  if (!schema.isValidSync({authProviderId, oldPassword, newPassword})) {
    return Result.fail(ChangeEmailProviderPasswordError.INVALID_REQUEST);
  }

  const authProviderResult = await authenticationService.getAuthProviderById(authProviderId);

  if (authProviderResult.isFailure) {
    return Result.fail(ChangeEmailProviderPasswordError.AUTHENTICATION_AUTH_PROVIDER_NOT_FOUND);
  }

  if (authProviderResult.success.type !== 'EMAIL') {
    return Result.fail(ChangeEmailProviderPasswordError.AUTHENTICATION_AUTH_PROVIDER_WRONG_PROVIDER);
  }

  const emailAuthProvider = authProviderResult.success as EmailAuthProviderInstance;

  const isValidOldPassword = await authenticationService.compareHashedPassword(oldPassword, emailAuthProvider.password);

  if (!isValidOldPassword) {
    return Result.fail(ChangeEmailProviderPasswordError.AUTHENTICATION_AUTH_PROVIDER_WRONG_PASSWORD);
  }

  const newHashedPassword = await authenticationService.hashPassword(newPassword);

  const searchQuery = prepareQueryOperation<EmailAuthProviderInstance>({id: emailAuthProvider.id});
  const updateQuery = prepareUpdateOperation<EmailAuthProviderInstance>({password: newHashedPassword});

  const updateEmailAuthProviderResult = await db.editAuthProvider(searchQuery, updateQuery);

  if (updateEmailAuthProviderResult.isFailure) {
    return Result.fail(ChangeEmailProviderPasswordError.AUTHENTICATION_AUTH_PROVIDER_NOT_FOUND);
  }

  const updatedEmailAuthProvider = updateEmailAuthProviderResult.success as EmailAuthProviderInstance;

  eventsService.emit<AuthenticationAuthProviderChangedPasswordEventPayload>(
    AuthenticationEvents.AUTHENTICATION_AUTH_PROVIDER_CHANGED_PASSWORD,
    updatedEmailAuthProvider
  );

  return Result.ok();
}
