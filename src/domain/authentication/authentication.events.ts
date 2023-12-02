import {BaseAccountInstance} from './entities/Account/BaseAccount.model.js';
import {BaseAuthProviderInstance} from './entities/AuthProvider/BaseAuthProvider.model.js';
import {EmailAuthProviderInstance} from './entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.model.js';

export const AuthenticationEvents = {
  AUTHENTICATION_ACCOUNT_CREATED: 'AUTHENTICATION_ACCOUNT_CREATED',
  AUTHENTICATION_ACCOUNT_REMOVED: 'AUTHENTICATION_ACCOUNT_REMOVED',
  AUTHENTICATION_ACCOUNT_UPDATED: 'AUTHENTICATION_ACCOUNT_UPDATED',
  AUTHENTICATION_LINKED_PROVIDER: 'AUTHENTICATION_LINKED_PROVIDER',
  AUTHENTICATION_UNLINKED_PROVIDER: 'AUTHENTICATION_UNLINKED_PROVIDER',
  AUTHENTICATION_EMAIL_PASSWORD_RESET_REQUESTED: 'AUTHENTICATION_EMAIL_PASSWORD_RESET_REQUESTED',
  AUTHENTICATION_AUTH_PROVIDER_CREATED: 'AUTHENTICATION_AUTH_PROVIDER_CREATED',
  AUTHENTICATION_AUTH_PROVIDER_CHANGED_PASSWORD: 'AUTHENTICATION_AUTH_PROVIDER_CHANGED_PASSWORD',
  AUTHENTICATION_AUTH_PROVIDER_CHANGED_PASSWORD_BY_CODE: 'AUTHENTICATION_AUTH_PROVIDER_CHANGED_PASSWORD_BY_CODE',
  AUTHENTICATION_AUTH_PROVIDER_CHANGED_EMAIL: 'AUTHENTICATION_AUTH_PROVIDER_CHANGED_EMAIL',
} as const;

export type AuthenticationAccountCreatedEventPayload = BaseAccountInstance;
export type AuthenticationAccountRemovedEventPayload = BaseAccountInstance;
export type AuthenticationAccountUpdatedEventPayload = BaseAccountInstance;

export interface AuthenticationLinkedProviderEventPayload {
  account: BaseAccountInstance;
  provider: BaseAuthProviderInstance;
}

export interface AuthenticationUnlinkedProviderEventPayload {
  account: BaseAccountInstance;
  providerId: string;
}

export type AuthenticationEmailPasswordResetRequestedEventPayload = EmailAuthProviderInstance;

export type AuthenticationAuthProviderCreatedEventPayload = BaseAuthProviderInstance;

export type AuthenticationAuthProviderChangedPasswordEventPayload = EmailAuthProviderInstance;

export type AuthenticationAuthProviderChangedPasswordByCodeEventPayload = EmailAuthProviderInstance;

export type AuthenticationAuthProviderChangedEmailEventPayload = EmailAuthProviderInstance;
