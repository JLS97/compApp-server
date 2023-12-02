import {BaseAccountInstance} from './entities/Account/BaseAccount.model.js';
import {BaseAuthProviderInstance} from './entities/AuthProvider/BaseAuthProvider.model.js';

export type AccessTokenEncoded = string;
export type RefreshTokenEncoded = string;

export interface AccessCredentials {
  accessToken: AccessTokenEncoded;
  refreshToken: RefreshTokenEncoded;
}

export interface AccessTokenPayload {
  accountIds: null | string[];
  authProviderId: string;
}

export interface AuthenticatedUser {
  accounts: BaseAccountInstance[];
  provider: BaseAuthProviderInstance;
}
