import {Schema} from 'mongoose';
import {DBBaseAuthProviderInstance, DBBaseAuthProviderValue, dbBaseAuthProviderSchema} from './BaseAuthProvider.js';
import { AuthProviderType } from '../../../../../domain/authentication/entities/AuthProvider/types.js';

export interface DBAppleAuthProviderValue extends DBBaseAuthProviderValue {
  type: typeof AuthProviderType.APPLE;
  email: string;
}

export interface DBAppleAuthProviderInstance extends DBBaseAuthProviderInstance, DBAppleAuthProviderValue {
  type: typeof AuthProviderType.APPLE;
}

export const dbAppleAuthProviderSchema = new Schema<DBAppleAuthProviderInstance>(
  {
    ...dbBaseAuthProviderSchema.obj,
    type: {type: String, enum: [AuthProviderType.APPLE], required: true,},
    email: {type: String, required: true},
  },
  {
    collection: 'authentication_authProviders',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);