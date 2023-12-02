import {Document, Schema} from 'mongoose';
import {BaseAuthProviderInstance, BaseAuthProviderValues} from '../../../../../domain/authentication/entities/AuthProvider/BaseAuthProvider.model.js';
import { AuthProviderFactory } from '../../../../../domain/authentication/entities/AuthProvider/AuthProvider.factory.js';

export interface DBBaseAuthProviderValue {
  type: string;
}

export interface DBBaseAuthProviderInstance extends DBBaseAuthProviderValue {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const dbBaseAuthProviderSchema = new Schema<DBBaseAuthProviderInstance>(
  {
    id: {type: String, required: true, unique: true},
    type: {type: String, required: true},
  },
  {
    collection: 'authentication_authProviders',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

export function DBAuthProviderToItem(dbItem: DBBaseAuthProviderValue & Document): BaseAuthProviderInstance {
  const baseParams = {...dbItem.toJSON()};

  const result = AuthProviderFactory.toCreate({...baseParams, ...dbItem})

  if(result.isFailure){
    return;
  }

  return result.success;
}

export function AuthProviderValueToDBItem(item: BaseAuthProviderValues): DBBaseAuthProviderValue {
  const result = AuthProviderFactory.toCreate({...item})

  if(result.isFailure){
    throw new Error(`Auth provider ${item.type} not supported`);
  }

  return result.success.values();
}

export function AuthProviderInstanceToDBItem(item: BaseAuthProviderInstance): DBBaseAuthProviderInstance {
  const result = AuthProviderFactory.toCreate({...item})

  if(result.isFailure){
    throw new Error(`Auth provider ${item.type} not supported`);
  }

  return result.success.instanceValues();
}
