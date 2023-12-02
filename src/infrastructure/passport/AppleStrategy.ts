import jwt from 'jsonwebtoken';
import {Strategy as PassportAppleStrategy} from 'passport-apple';
import {AuthenticationService} from '../../application/authentication/authentication.service.js';
import {LoggerService} from '../../domain/logger/LoggerService.js';
import {AppleAuthProviderInstance, AppleAuthProviderValues} from '../../domain/authentication/entities/AuthProvider/AppleAuthProvider/AppleAuthProvider.model.js';
import {setPassportUser} from './setPassportUser.js';

export interface AppleStrategyParams {
  clientId: string;
  teamId: string;
  callbackUrl: string;
  keyId: string;
  privateKeyLocation: string;
  authenticationService: AuthenticationService;
  loggerService?: LoggerService;
}

export function AppleStrategy(params: AppleStrategyParams) {
  return new PassportAppleStrategy(
    {
      clientID: params.clientId,
      teamID: params.teamId,
      callbackURL: params.callbackUrl,
      keyID: params.keyId,
      privateKeyLocation: params.privateKeyLocation,
      passReqToCallback: true,
    },
    async (_: any, accessToken: string, refreshToken: string, idToken: string, profile: any, done: any) => {
      try {
        const decoded = jwt.decode(idToken);

        if (!decoded) {
          params.loggerService?.error(AppleStrategy.name, 'The token of apple could not be decodified');
          return done(null, false);
        }

        const payload = decoded as jwt.JwtPayload;
        const authProviderId = payload.sub as string;
        const email = payload.email as string; // Es posible que el email no lo devuelva en próximas peticiones

        const authProviderResult = await params.authenticationService.getAuthProviderById(authProviderId);

        if (authProviderResult.isFailure) {
          const providerCreationResult = await params.authenticationService.createAuthProvider<AppleAuthProviderInstance, AppleAuthProviderValues>({
            id: authProviderId,
            email,
            type: 'APPLE',
          });

          if (providerCreationResult.isFailure) {
            return done(null, false);
          }

          return done(null, setPassportUser([], providerCreationResult.success.id));
        }

        const accountsResult = await params.authenticationService.getAccountsByAuthProviderId(authProviderResult.success.id);

        if (accountsResult.isFailure) {
          params.loggerService?.error(AppleStrategy.name, `Incorrect request`);
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
        params.loggerService?.error(AppleStrategy.name, {name: error.name, message: error.message, stack: error.stack});
        return done(_error, false);
      }
    }
  );
}
