import * as yup from 'yup';
import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {EmailAuthProviderInstance} from '../../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {EventsService} from '../../../domain/events/EventsService.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import {AuthenticationService} from '../authentication.service.js';
import {EmailAuthProviderSchema} from '../../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.schemas.js';
import {AuthenticationAuthProviderChangedPasswordByCodeEventPayload, AuthenticationEvents} from '../../../domain/authentication/authentication.events.js';
import {isAfter} from 'date-fns';
import {prepareQueryOperation} from '../../../domain/operations/prepareQueryOperation.js';
import {prepareUpdateOperation} from '../../../domain/operations/prepareUpdateOperation.js';
import { EntitySchemas } from '../../../domain/core/entities/Entity/Entity.schemas.js';

export const ChangeEmailProviderPasswordByCodeError = {
  ...CoreResponses.InvalidRequest,
  ...AuthenticationResponses.AuthProviderNotFound,
  ...AuthenticationResponses.AuthProviderWrongCode,
  ...AuthenticationResponses.AuthProviderWrongProvider,
  ...AuthenticationResponses.AuthProviderCodeExpired,
} as const;
export type ChangeEmailProviderPasswordByCodeError = (typeof ChangeEmailProviderPasswordByCodeError)[keyof typeof ChangeEmailProviderPasswordByCodeError];

export async function changeEmailProviderPasswordByCode(
  authenticationService: AuthenticationService,
  db: AuthenticationDatabase,
  eventsService: EventsService,
  authProviderId: string,
  code: string,
  newPassword: string
): Promise<Result<EmailAuthProviderInstance, ChangeEmailProviderPasswordByCodeError>> {
  const schema = yup.object().shape({
    authProviderId: EntitySchemas.id.required(),
    code: EmailAuthProviderSchema.resetPasswordCode.required(),
    newPassword: EmailAuthProviderSchema.password.required(),
  });

  if (!schema.isValidSync({authProviderId, code, newPassword})) {
    return Result.fail(ChangeEmailProviderPasswordByCodeError.INVALID_REQUEST);
  }

  const authProviderResult = await authenticationService.getAuthProviderById(authProviderId);

  if (authProviderResult.isFailure) {
    return Result.fail(ChangeEmailProviderPasswordByCodeError.AUTHENTICATION_AUTH_PROVIDER_NOT_FOUND);
  }

  if (authProviderResult.success.type !== 'EMAIL') {
    return Result.fail(ChangeEmailProviderPasswordByCodeError.AUTHENTICATION_AUTH_PROVIDER_WRONG_PROVIDER);
  }

  const emailAuthProvider = authProviderResult.success as EmailAuthProviderInstance;

  if (!emailAuthProvider.resetPasswordCode || emailAuthProvider.resetPasswordCode !== code) {
    return Result.fail(ChangeEmailProviderPasswordByCodeError.AUTHENTICATION_AUTH_PROVIDER_WRONG_CODE);
  }

  if (emailAuthProvider.resetPasswordCodeExpiresAt && isAfter(new Date(Date.now()), emailAuthProvider.resetPasswordCodeExpiresAt)) {
    return Result.fail(ChangeEmailProviderPasswordByCodeError.AUTHENTICATION_AUTH_PROVIDER_CODE_EXPIRED);
  }

  const newHashedPassword = await authenticationService.hashPassword(newPassword);

  const searchQuery = prepareQueryOperation<EmailAuthProviderInstance>({id: emailAuthProvider.id});
  const updateQuery = prepareUpdateOperation<EmailAuthProviderInstance>({
    password: newHashedPassword,
    resetPasswordCode: null,
    resetPasswordCodeExpiresAt: null,
  });

  const updateEmailAuthProviderResult = await db.editAuthProvider(searchQuery, updateQuery);

  if (updateEmailAuthProviderResult.isFailure) {
    return Result.fail(ChangeEmailProviderPasswordByCodeError.AUTHENTICATION_AUTH_PROVIDER_NOT_FOUND);
  }

  const updatedEmailAuthProvider = updateEmailAuthProviderResult.success as EmailAuthProviderInstance;

  eventsService.emit<AuthenticationAuthProviderChangedPasswordByCodeEventPayload>(
    AuthenticationEvents.AUTHENTICATION_AUTH_PROVIDER_CHANGED_PASSWORD_BY_CODE,
    updatedEmailAuthProvider
  );

  return Result.ok();
}
