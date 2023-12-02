import {AuthenticatedUser} from '../../../domain/authentication/types.js';

export function hasAccessToAccount(accountId: string, authenticatedUser: AuthenticatedUser): boolean {
  const selectedAccount = authenticatedUser.accounts.find((item) => item.id === accountId);

  if (!selectedAccount) {
    return false;
  }

  return selectedAccount.providersId.includes(authenticatedUser.provider.id);
}
