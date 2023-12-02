import {Strategy as PassportJWTStrategy, ExtractJwt} from 'passport-jwt';
import {AuthenticationService} from '../../application/authentication/authentication.service.js';
import {AccessTokenPayload} from '../../domain/authentication/types.js';
import {LoggerService} from '../../domain/logger/LoggerService.js';

interface JWTStrategyParams {
  secret: string;
  authenticationService: AuthenticationService;
  loggerService?: LoggerService;
}

export function JwtStrategy(params: JWTStrategyParams) {
  return new PassportJWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: params.secret,
    },
    async function (payload: AccessTokenPayload, done) {
      try {
        const accountsDetailsResult = await params.authenticationService.getAccountsById(payload.accountIds);

        if (accountsDetailsResult.isFailure) {
          return done(null, false, {message: accountsDetailsResult.failure});
        }

        const authProviderDetailsResult = await params.authenticationService.getAuthProviderById(payload.authProviderId);
        
        if (authProviderDetailsResult.isFailure) {
          return done(null, false, {message: authProviderDetailsResult.failure});
        }

        return done(null, {
          accounts: accountsDetailsResult.success,
          provider: authProviderDetailsResult.success,
        });
      } catch (_error) {
        const error = _error as Error;
        params.loggerService?.error(JwtStrategy.name, {name: error.name, message: error.message, stack: error.stack});
        return done(_error, false);
      }
    }
  );
}
