import * as yup from 'yup';
import {EmailAuthProviderInstance} from '../../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.model.js';
import {Result} from '../../../domain/core/types/Result.js';
import {CoreResponses} from '../../../domain/core/core.responses.js';
import {AuthenticationResponses} from '../authentication.responses.js';
import {EmailAuthProviderSchema} from '../../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.schemas.js';
import {AuthenticationService} from '../authentication.service.js';

export const LoginWithEmailAndPasswordError = {
  ...CoreResponses.InvalidRequest,
  ...AuthenticationResponses.AuthProviderEmailNotFound,
  ...AuthenticationResponses.AuthProviderWrongPassword,
} as const;
export type LoginWithEmailAndPasswordError = (typeof LoginWithEmailAndPasswordError)[keyof typeof LoginWithEmailAndPasswordError];

export async function loginWithEmailAndPassword(
  authenticationService: AuthenticationService,
  email: string,
  password: string
): Promise<Result<EmailAuthProviderInstance, LoginWithEmailAndPasswordError>> {
  const schema = yup.object().shape({
    email: EmailAuthProviderSchema.email.required(),
    password: yup.string().required(),
  });

  if (!schema.isValidSync({email, password})) {
    return Result.fail(LoginWithEmailAndPasswordError.INVALID_REQUEST);
  }

  const emailAuthProviderResult = await authenticationService.getAuthProviderByEmail(email, 'EMAIL');

  if (emailAuthProviderResult.isFailure) {
    return Result.fail(LoginWithEmailAndPasswordError.AUTHENTICATION_AUTH_PROVIDER_EMAIL_NOT_FOUND);
  }

  const emailAuthProvider = emailAuthProviderResult.success as EmailAuthProviderInstance;

  const isValidPassword = await authenticationService.compareHashedPassword(password, emailAuthProvider.password);

  if (!isValidPassword) {
    return Result.fail(LoginWithEmailAndPasswordError.AUTHENTICATION_AUTH_PROVIDER_WRONG_PASSWORD);
  }

  return Result.ok(emailAuthProvider);
}
