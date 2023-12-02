import {Strategy as PassportGoogleStrategy} from 'passport-google-oauth20';
import {AuthenticationService} from '../../application/authentication/authentication.service.js';
import {LoggerService} from '../../domain/logger/LoggerService.js';
import {setPassportUser} from './setPassportUser.js';
import {GoogleAuthProviderInstance, GoogleAuthProviderValues} from '../../domain/authentication/entities/AuthProvider/GoogleAuthProvider/GoogleAuthProvider.model.js';

export interface GoogleStrategyParams {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  authenticationService: AuthenticationService;
  loggerService?: LoggerService;
}

export function GoogleStrategy(params: GoogleStrategyParams) {
  return new PassportGoogleStrategy(
    {
      clientID: params.clientId,
      clientSecret: params.clientSecret,
      callbackURL: params.callbackUrl,
      scope: ['email', 'profile'],
    },
    async (accessToken, refreshToken, profile, done: any) => {
      try {
        const verifiedEmail = profile?.emails?.find((email) => email.verified) || profile.emails?.[0];
        const email = verifiedEmail ? verifiedEmail.value : null;

        if (!email) {
          params.loggerService?.error(GoogleStrategy.name, 'No se ha encontrado ningún email en la respuesta');
          return done(null, false);
        }

        const authProviderResult = await params.authenticationService.getAuthProviderByEmail(email, 'GOOGLE');

        if (authProviderResult.isFailure) {
          const providerCreationResult = await params.authenticationService.createAuthProvider<GoogleAuthProviderInstance, GoogleAuthProviderValues>({
            email,
            type: 'GOOGLE',
          });

          if (providerCreationResult.isFailure) {
            return done(null, false);
          }

          return done(null, setPassportUser([], providerCreationResult.success.id));
        }

        const accountsResult = await params.authenticationService.getAccountsByAuthProviderId(authProviderResult.success.id);

        if (accountsResult.isFailure) {
          params.loggerService?.error(GoogleStrategy.name, 'The request has been incorrect');
          return done(null, false);
        }

        return done(
          null,
          setPassportUser(
            accountsResult.success.map((item) => item.id),
            authProviderResult.success.id
          )
        );
      } catch (_error) {
        const error = _error as Error;
        params.loggerService?.error(GoogleStrategy.name, {name: error.name, message: error.message, stack: error.stack});
        return done(_error, false);
      }
    }
  );
}
