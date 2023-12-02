export interface PassportUser {
  accountIds: string[];
  authProviderId: string;
}

export function setPassportUser(accountIds: string[], authProviderId: string): PassportUser {
  return {
    accountIds,
    authProviderId,
  };
}
