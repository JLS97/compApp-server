import {Paginated} from '../core/types/Paginated.js';
import {Result} from '../core/types/Result.js';
import {Operation} from '../operations/types.js';
import {BaseAccountInstance, BaseAccountValues} from './entities/Account/BaseAccount.model.js';
import {BaseAuthProviderInstance, BaseAuthProviderValues} from './entities/AuthProvider/BaseAuthProvider.model.js';
import {RefreshTokenInstance, RefreshTokenValues} from './entities/RefreshToken/RefreshToken.model.js';

export abstract class AuthenticationDatabase {
  // ------------------ //
  // ACCOUNT
  // ------------------ //
  abstract findAccount<T extends BaseAccountInstance>(filters: Partial<Record<keyof T, Operation>>): Promise<Result<BaseAccountInstance, undefined>>;
  abstract findAccounts<T extends BaseAccountInstance>(filters: Partial<Record<keyof T, Operation>>): Promise<Result<BaseAccountInstance[], undefined>>;
  abstract findAccountsPaginated<T extends BaseAccountInstance>(
    filters: Partial<Record<keyof T, Operation>>,
    page: number,
    pageSize: number
  ): Promise<Result<Paginated<BaseAccountInstance>, undefined>>;
  abstract editAccount<T extends BaseAccountInstance>(
    searchBy: Partial<Record<keyof T, Operation>>,
    newValues: Partial<Record<keyof T, Operation>>
  ): Promise<Result<BaseAccountInstance, undefined>>;
  abstract removeAccount<T extends BaseAccountInstance>(criteria: Partial<Record<keyof T, Operation>>): Promise<Result<BaseAccountInstance, undefined>>;
  abstract addAccount<T extends BaseAccountInstance, K extends BaseAccountValues>(instance: Partial<T> & K): Promise<Result<BaseAccountInstance, undefined>>;
  abstract addAccounts<T extends BaseAccountInstance, K extends BaseAccountValues>(instances: (Partial<T> & K)[]): Promise<Result<BaseAccountInstance[], undefined>>;

  // ------------------ //
  // AUTH PROVIDER
  // ------------------ //
  abstract findAuthProvider<T extends BaseAuthProviderInstance>(
    filters: Partial<Record<keyof T, Operation>>
  ): Promise<Result<BaseAuthProviderInstance, undefined>>;
  abstract findAuthProviders<T extends BaseAuthProviderInstance>(
    filters: Partial<Record<keyof T, Operation>>
  ): Promise<Result<BaseAuthProviderInstance[], undefined>>;
  abstract editAuthProvider<T extends BaseAuthProviderInstance>(
    searchBy: Partial<Record<keyof T, Operation>>,
    newValues: Partial<Record<keyof T, Operation>>
  ): Promise<Result<BaseAuthProviderInstance, undefined>>;
  abstract removeAuthProvider<T extends BaseAuthProviderInstance>(
    criteria: Partial<Record<keyof T, Operation>>
  ): Promise<Result<BaseAuthProviderInstance, undefined>>;
  abstract addAuthProvider<T extends BaseAuthProviderInstance, K extends BaseAuthProviderValues>(
    instance: Partial<T> & K
  ): Promise<Result<BaseAuthProviderInstance, undefined>>;
  abstract addAuthProviders<T extends BaseAuthProviderInstance, K extends BaseAuthProviderValues>(
    instances: (Partial<T> & K)[]
  ): Promise<Result<BaseAuthProviderInstance[], undefined>>;

  // ------------------ //
  // REFRESH TOKEN
  // ------------------ //

  abstract findRefreshToken<T extends RefreshTokenInstance>(filters: Partial<Record<keyof T, Operation>>): Promise<Result<RefreshTokenInstance, undefined>>;
  abstract editRefreshToken<T extends RefreshTokenInstance>(
    searchBy: Partial<Record<keyof T, Operation>>,
    newValues: Partial<Record<keyof T, Operation>>
  ): Promise<Result<RefreshTokenInstance, undefined>>;
  abstract removeRefreshToken<T extends RefreshTokenInstance>(criteria: Partial<Record<keyof T, Operation>>): Promise<Result<RefreshTokenInstance, undefined>>;
  abstract addRefreshToken<T extends RefreshTokenInstance, K extends RefreshTokenValues>(
    instance: Partial<T> & K
  ): Promise<Result<RefreshTokenInstance, undefined>>;
}
