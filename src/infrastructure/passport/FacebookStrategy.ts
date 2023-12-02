import {Strategy as PassportFacebookStrategy} from 'passport-facebook';
import {AuthenticationService} from '../../application/authentication/authentication.service.js';
import {LoggerService} from '../../domain/logger/LoggerService.js';
import {setPassportUser} from './setPassportUser.js';
import {FacebookAuthProviderInstance, FacebookAuthProviderValues} from '../../domain/authentication/entities/AuthProvider/FacebookAuthProvider/FacebookAuthProvider.model.js';

export interface FacebookStrategyParams {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  authenticationService: AuthenticationService;
  loggerService?: LoggerService;
}

export function FacebookStrategy(params: FacebookStrategyParams) {
  return new PassportFacebookStrategy(
    {
      clientID: params.clientId,
      clientSecret: params.clientSecret,
      callbackURL: params.callbackUrl,
      scope: ['email', 'public_profile'],
    },
    async (accessToken, refreshToken, profile, done: any) => {
      try {
        const authProviderResult = await params.authenticationService.getFacebookAuthProviderByProfileId(profile.id);

        if (authProviderResult.isFailure) {
          const providerCreationResult = await params.authenticationService.createAuthProvider<FacebookAuthProviderInstance, FacebookAuthProviderValues>({
            type: 'FACEBOOK',
            profileId: profile.id,
          });

          if (providerCreationResult.isFailure) {
            return done(null, false);
          }

          return done(null, setPassportUser([], providerCreationResult.success.id));
        }

        const accountsResult = await params.authenticationService.getAccountsByAuthProviderId(authProviderResult.success.id);

        if (accountsResult.isFailure) {
          params.loggerService?.error(FacebookStrategy.name, 'The request has been incorrect');
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
        params.loggerService?.error(FacebookStrategy.name, {name: error.name, message: error.message, stack: error.stack});
        return done(_error, false);
      }
    }
  );
}
