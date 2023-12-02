import {AuthenticationEmailPasswordResetRequestedEventPayload, AuthenticationEvents} from '../../../domain/authentication/authentication.events.js';
import {EmailAuthProviderInstance} from '../../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.model.js';
import {EmailAuthProviderSchema} from '../../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.schemas.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {EventsService} from '../../../domain/events/EventsService.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import {AuthenticationService} from '../authentication.service.js';

export const RequestPasswordResetEmailError = {
  ...CoreResponses.InvalidRequest,
  ...AuthenticationResponses.AuthProviderEmailNotFound,
} as const;
export type RequestPasswordResetEmailError = (typeof RequestPasswordResetEmailError)[keyof typeof RequestPasswordResetEmailError];

export async function requestPasswordResetEmail(
  authenticationService: AuthenticationService,
  eventsService: EventsService,
  email: string
): Promise<Result<undefined, RequestPasswordResetEmailError>> {
  if (!EmailAuthProviderSchema.email.required().isValidSync(email)) {
    return Result.fail(RequestPasswordResetEmailError.INVALID_REQUEST);
  }

  const authProviderResult = await authenticationService.getAuthProviderByEmail(email, 'EMAIL');

  if (authProviderResult.isFailure) {
    return Result.fail(RequestPasswordResetEmailError.AUTHENTICATION_AUTH_PROVIDER_EMAIL_NOT_FOUND);
  }

  const emailAuthProvider = authProviderResult.success as EmailAuthProviderInstance;

  eventsService.emit<AuthenticationEmailPasswordResetRequestedEventPayload>(
    AuthenticationEvents.AUTHENTICATION_EMAIL_PASSWORD_RESET_REQUESTED,
    emailAuthProvider
  );

  return Result.ok();
}
