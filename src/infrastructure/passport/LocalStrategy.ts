import {Strategy as PassportLocalStrategy} from 'passport-local';
import {AuthenticationService} from '../../application/authentication/authentication.service.js';
import {LoggerService} from '../../domain/logger/LoggerService.js';

interface LocalStrategyParams {
  authenticationService: AuthenticationService;
  loggerService?: LoggerService;
}

export function LocalStrategy(params: LocalStrategyParams) {
  return new PassportLocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email: string, password: string, done) => {
      try {
        const formattedEmail = email.toLocaleLowerCase().trim();

        const loginResult = await params.authenticationService.loginWithEmailAndPassword(formattedEmail, password);

        if (loginResult.isFailure) {
          if (typeof loginResult.failure !== 'string') {
            return done(null, false, {message: JSON.stringify(loginResult.failure)});
          }

          return done(null, false, {message: loginResult.failure});
        }

        const emailAuthProvider = loginResult.success;

        const accountsResult = await params.authenticationService.getAccountsByAuthProviderId(emailAuthProvider.id);

        if (accountsResult.isFailure) {
          return done(null, false, {message: accountsResult.failure});
        }

        return done(null, {
          accounts: accountsResult.success,
          provider: emailAuthProvider,
        });
      } catch (_error) {
        const error = _error as Error;
        params.loggerService?.error(LocalStrategy.name, {name: error.name, message: error.message, stack: error.stack});
        return done(_error, false);
      }
    }
  );
}
