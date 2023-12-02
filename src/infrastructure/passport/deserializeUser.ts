import {AuthenticationService} from '../../application/authentication/authentication.service.js';
import {PassportUser} from './setPassportUser.js';

export function deserializeUser(authenticationService: AuthenticationService) {
  return async (user: PassportUser, done: (err: any, user: false | Express.User | null | undefined) => void) => {
    const accountsResult = await authenticationService.getAccountsById(user.accountIds);

    if (accountsResult.isFailure) {
      done(null, false);
      return;
    }

    const authProviderResult = await authenticationService.getAuthProviderById(user.authProviderId);

    if (authProviderResult.isFailure) {
      done(null, false);
      return;
    }

    done(null, {
      accounts: accountsResult.success,
      provider: authProviderResult.success,
    });
  };
}
