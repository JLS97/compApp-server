import {AuthenticationDatabase} from '../../../../domain/authentication/authentication.database.js';
import {Result} from '../../../../domain/core/types/Result.js';
import {BaseAuthProviderInstance, BaseAuthProviderValues} from '../../../../domain/authentication/entities/AuthProvider/BaseAuthProvider.model.js';
import {RefreshTokenInstance, RefreshTokenValues} from '../../../../domain/authentication/entities/RefreshToken/RefreshToken.model.js';
import {Paginated} from '../../../../domain/core/types/Paginated.js';
import {Operation} from '../../../../domain/operations/types.js';
import {MongoDBDatabase, MongoDBDatabaseParams} from '../MongoDBDatabase.js';
import {AccountInstanceToDBItem, DBBaseAccountInstance, DBAccountToItem, dbBaseAccountSchema} from './account/BaseAccountDBModel.js';
import {Model} from 'mongoose';
import {DBRefreshTokenInstance, DBRefreshTokenToItem, RefreshTokenInstanceToDBItem, dbRefreshTokenSchema} from './refreshToken/RefreshTokenDBModel.js';
import {AuthProviderInstanceToDBItem, DBBaseAuthProviderInstance, DBAuthProviderToItem, dbBaseAuthProviderSchema} from './authProvider/BaseAuthProvider.js';
import {dbEmailAuthProviderSchema} from './authProvider/EmailAuthProvider.js';
import {dbAppleAuthProviderSchema} from './authProvider/AppleAuthProvider.js';
import {dbAuthProviderGoogleSchema} from './authProvider/GoogleAuthProvider.js';
import {dbFacebookAuthProviderSchema} from './authProvider/FacebookAuthProvider.js';
import {AuthProviderType} from '../../../../domain/authentication/entities/AuthProvider/types.js';
import {findOne} from '../core/operations/findOne.js';
import {findMany} from '../core/operations/findMany.js';
import {findPaginated} from '../core/operations/findPaginated.js';
import {removeOne} from '../core/operations/removeOne.js';
import {createOne} from '../core/operations/createOne.js';
import {createMany} from '../core/operations/createMany.js';
import {editOne} from '../core/operations/editOne.js';
import { dbPersonalAccountSchema } from './account/PersonalAccountDBModel.js';
import { AccountType } from '../../../../domain/authentication/entities/Account/types.js';
import { documentSelector } from '../core/utils/documentSelector.js';
import { BaseAccount, BaseAccountInstance, BaseAccountValues } from '../../../../domain/authentication/entities/Account/BaseAccount.model.js';

export class MongoDBAuthenticationDatabase extends MongoDBDatabase implements AuthenticationDatabase {
  private accountModel: Model<DBBaseAccountInstance>;
  private authProviderModel: Model<DBBaseAuthProviderInstance>;
  private refreshTokenModel: Model<DBRefreshTokenInstance>;

  private accountModelMaps: Record<string, Model<DBBaseAccountInstance>>;
  private authProviderModelMaps: Record<string, Model<DBBaseAuthProviderInstance>>;

  constructor(params: MongoDBDatabaseParams) {
    super(params);

    const connection = this.getConnection();

    this.accountModel = connection.model('Account', dbBaseAccountSchema);
    this.accountModel.discriminator("PersonalAccount", dbPersonalAccountSchema);

    this.authProviderModel = connection.model('AuthProvider', dbBaseAuthProviderSchema);
    this.authProviderModel.discriminator('EmailAuthProvider', dbEmailAuthProviderSchema);
    this.authProviderModel.discriminator('AppleAuthProvider', dbAppleAuthProviderSchema);
    this.authProviderModel.discriminator('GoogleAuthProvider', dbAuthProviderGoogleSchema);
    this.authProviderModel.discriminator('FacebookAuthProvider', dbFacebookAuthProviderSchema);

    this.refreshTokenModel = connection.model('RefreshToken', dbRefreshTokenSchema);

    this.accountModelMaps = {
      [AccountType.PERSONAL]: connection.model('PersonalAccount'),
    };

    this.authProviderModelMaps = {
      [AuthProviderType.EMAIL]: connection.model('EmailAuthProvider'),
      [AuthProviderType.APPLE]: connection.model('AppleAuthProvider'),
      [AuthProviderType.GOOGLE]: connection.model('GoogleAuthProvider'),
      [AuthProviderType.FACEBOOK]: connection.model('FacebookAuthProvider'),
    };
  }

  // ------------------ //
  // ACCOUNT
  // ------------------ //

  async addAccount<T extends BaseAccountInstance, K extends BaseAccountValues>(instance: Partial<T> & K): Promise<Result<BaseAccount, undefined>> {
    return await createOne(this.accountModel, AccountInstanceToDBItem, DBAccountToItem, documentSelector(this.accountModelMaps, "type"))(instance);
  }

  async addAccounts<T extends BaseAccountInstance, K extends BaseAccountValues>(instances: (Partial<T> & K)[]): Promise<Result<BaseAccountInstance[], undefined>> {
    return await createMany(this.accountModel, AccountInstanceToDBItem, DBAccountToItem, documentSelector(this.accountModelMaps, "type"))(instances);
  }

  async editAccount<T extends BaseAccountInstance>(
    searchBy: Partial<Record<keyof T, Operation>>,
    newValues: Partial<Record<keyof T, Operation>>
  ): Promise<Result<BaseAccountInstance, undefined>> {
    return await editOne(this.accountModel, DBAccountToItem)(searchBy, newValues);
  }

  async findAccount<T extends BaseAccountInstance>(filters: Partial<Record<keyof T, Operation>>): Promise<Result<BaseAccountInstance, undefined>> {
    return await findOne(this.accountModel, DBAccountToItem)(filters);
  }

  async findAccounts<T extends BaseAccountInstance>(filters: Partial<Record<keyof T, Operation>>): Promise<Result<BaseAccountInstance[], undefined>> {
    return await findMany(this.accountModel, DBAccountToItem)(filters);
  }

  async findAccountsPaginated<T extends BaseAccountInstance>(
    filters: Partial<Record<keyof T, Operation>>,
    page: number,
    pageSize: number
  ): Promise<Result<Paginated<BaseAccountInstance>, undefined>> {
    return await findPaginated(this.accountModel, DBAccountToItem)(filters, page, pageSize);
  }

  async removeAccount<T extends BaseAccountInstance>(criteria: Partial<Record<keyof T, Operation>>): Promise<Result<BaseAccountInstance, undefined>> {
    return await removeOne(this.accountModel, DBAccountToItem)(criteria);
  }

  // ------------------ //
  // AUTH PROVIDER
  // ------------------ //

  async addAuthProvider<T extends BaseAuthProviderInstance, K extends BaseAuthProviderValues>(
    instance: Partial<T> & K
  ): Promise<Result<BaseAuthProviderInstance, undefined>> {
    return await createOne(
      this.authProviderModel,
      AuthProviderInstanceToDBItem,
      DBAuthProviderToItem,
      documentSelector(this.authProviderModelMaps, "type")
    )(instance);
  }

  async addAuthProviders<T extends BaseAuthProviderInstance, K extends BaseAuthProviderValues>(
    instances: (Partial<T> & K)[]
  ): Promise<Result<BaseAuthProviderInstance[], undefined>> {
    return await createMany(
      this.authProviderModel,
      AuthProviderInstanceToDBItem,
      DBAuthProviderToItem,
      documentSelector(this.authProviderModelMaps, "type")
    )(instances);
  }

  async editAuthProvider<T extends BaseAuthProviderInstance>(
    searchBy: Partial<Record<keyof T, Operation>>,
    newValues: Partial<Record<keyof T, Operation>>
  ): Promise<Result<BaseAuthProviderInstance, undefined>> {
    return await editOne(this.authProviderModel, DBAuthProviderToItem)(searchBy, newValues);
  }

  async findAuthProvider<T extends BaseAuthProviderInstance>(
    filters: Partial<Record<keyof T, Operation>>
  ): Promise<Result<BaseAuthProviderInstance, undefined>> {
    return await findOne(this.authProviderModel, DBAuthProviderToItem)(filters);
  }

  async findAuthProviders<T extends BaseAuthProviderInstance>(
    filters: Partial<Record<keyof T, Operation>>
  ): Promise<Result<BaseAuthProviderInstance[], undefined>> {
    return await findMany(this.authProviderModel, DBAuthProviderToItem)(filters);
  }

  async removeAuthProvider<T extends BaseAuthProviderInstance>(
    criteria: Partial<Record<keyof T, Operation>>
  ): Promise<Result<BaseAuthProviderInstance, undefined>> {
    return await removeOne(this.authProviderModel, DBAuthProviderToItem)(criteria);
  }

  // ------------------ //
  // REFRESH TOKEN
  // ------------------ //

  async addRefreshToken<T extends RefreshTokenInstance, K extends RefreshTokenValues>(
    instance: Partial<T> & K
  ): Promise<Result<RefreshTokenInstance, undefined>> {
    return await createOne(this.refreshTokenModel, RefreshTokenInstanceToDBItem, DBRefreshTokenToItem)(instance);
  }

  async editRefreshToken<T extends RefreshTokenInstance>(
    searchBy: Partial<Record<keyof T, Operation>>,
    newValues: Partial<Record<keyof T, Operation>>
  ): Promise<Result<RefreshTokenInstance, undefined>> {
    return await editOne(this.refreshTokenModel, DBRefreshTokenToItem)(searchBy, newValues);
  }

  async findRefreshToken<T extends RefreshTokenInstance>(filters: Partial<Record<keyof T, Operation>>): Promise<Result<RefreshTokenInstance, undefined>> {
    return await findOne(this.refreshTokenModel, DBRefreshTokenToItem)(filters);
  }

  async removeRefreshToken<T extends RefreshTokenInstance>(criteria: Partial<Record<keyof T, Operation>>): Promise<Result<RefreshTokenInstance, undefined>> {
    return await removeOne(this.refreshTokenModel, DBRefreshTokenToItem)(criteria);
  }
}
