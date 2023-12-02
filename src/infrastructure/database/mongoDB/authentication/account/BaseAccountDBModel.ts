import {Document, Schema} from 'mongoose';
import {BaseAccount, BaseAccountInstance, BaseAccountValues} from '../../../../../domain/authentication/entities/Account/BaseAccount.model.js';
import {AccountFactory} from '../../../../../domain/authentication/entities/Account/Account.factory.js';
import {DBAuthProviderToItem} from '../authProvider/BaseAuthProvider.js';

export interface DBBaseAccountValue {
  type: string;
  providersId: string[];
}

export interface DBBaseAccountInstance extends DBBaseAccountValue {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const dbBaseAccountSchema = new Schema<DBBaseAccountInstance>(
  {
    id: {type: String, required: true, unique: true},
    type: {type: String, required: true},
    providersId: [{type: String}],
  },
  {
    collection: 'authentication_accounts',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

export const AccountVirtuals = {
  providers: 'providers',
} as const;
export type AccountVirtuals = (typeof AccountVirtuals)[keyof typeof AccountVirtuals];

dbBaseAccountSchema.virtual(AccountVirtuals.providers, {
  ref: 'AuthProvider',
  localField: 'providersId',
  foreignField: 'id',
  justOne: false,
});

export function DBAccountToItem(dbItem: DBBaseAccountValue & Document & {providers?: (DBBaseAccountInstance & Document)[]}): BaseAccount {
  const baseParams = {...dbItem.toJSON()};

  const result = AccountFactory.toCreate({
    ...baseParams, 
    ...dbItem, 
    providers: dbItem.providers?.map(DBAuthProviderToItem) ?? []
  });

  if (result.isFailure) {
    return;
  }

  return result.success;
}

export function AccountValueToDBItem(item: BaseAccountValues): DBBaseAccountValue {
  const result = AccountFactory.toCreate({...item});

  if (result.isFailure) {
    throw new Error(`Account ${item.type} not supported`);
  }

  return result.success.values();
}

export function AccountInstanceToDBItem(item: BaseAccountInstance): DBBaseAccountInstance {
  const result = AccountFactory.toCreate({...item});

  if (result.isFailure) {
    throw new Error(`Account ${item.type} not supported`);
  }

  return result.success.instanceValues();
}
