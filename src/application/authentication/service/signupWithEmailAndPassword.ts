import * as yup from 'yup';
import {EmailAuthProviderInstance, EmailAuthProviderValues} from '../../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import {EmailAuthProviderSchema} from '../../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.schemas.js';
import {AuthenticationService} from '../authentication.service.js';
import {AuthenticationDatabase} from '../../../domain/authentication/authentication.database.js';
import {EventsService} from '../../../domain/events/EventsService.js';
import {AuthenticationAuthProviderCreatedEventPayload, AuthenticationEvents} from '../../../domain/authentication/authentication.events.js';

export const SignupWithEmailAndPasswordError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
  ...AuthenticationResponses.AuthProviderDuplicatedEmail,
} as const;
export type SignupWithEmailAndPasswordError = (typeof SignupWithEmailAndPasswordError)[keyof typeof SignupWithEmailAndPasswordError];

export async function signupWithEmailAndPassword(
  authenticationService: AuthenticationService,
  db: AuthenticationDatabase,
  eventsService: EventsService,
  email: string,
  password: string
): Promise<Result<EmailAuthProviderInstance, SignupWithEmailAndPasswordError>> {
  const schema = yup.object().shape({
    email: EmailAuthProviderSchema.email.required(),
    password: EmailAuthProviderSchema.password.required(),
  });

  if (!schema.isValidSync({email, password})) {
    return Result.fail(SignupWithEmailAndPasswordError.INVALID_REQUEST);
  }

  const emailAuthProviderResult = await authenticationService.getAuthProviderByEmail(email, 'EMAIL');

  if (emailAuthProviderResult.isSuccess) {
    return Result.fail(SignupWithEmailAndPasswordError.AUTHENTICATION_AUTH_PROVIDER_DUPLICATED_EMAIL);
  }

  const hashedPassword = await authenticationService.hashPassword(password);

  const authProviderCreationResult = await db.addAuthProvider<EmailAuthProviderInstance, EmailAuthProviderValues>({
    email,
    password: hashedPassword,
    type: 'EMAIL',
  });

  if (authProviderCreationResult.isFailure) {
    return Result.fail(SignupWithEmailAndPasswordError.UNKNOWN);
  }

  const emailAuthProvider = authProviderCreationResult.success as EmailAuthProviderInstance;

  eventsService.emit<AuthenticationAuthProviderCreatedEventPayload>(AuthenticationEvents.AUTHENTICATION_AUTH_PROVIDER_CREATED, emailAuthProvider);

  return Result.ok(emailAuthProvider);
}
