import {Schema} from 'mongoose';
import {DBBaseAuthProviderInstance, DBBaseAuthProviderValue, dbBaseAuthProviderSchema} from './BaseAuthProvider.js';
import { AuthProviderType } from '../../../../../domain/authentication/entities/AuthProvider/types.js';

export interface DBAuthProviderGoogleValue extends DBBaseAuthProviderValue {
  type: typeof AuthProviderType.GOOGLE;
  email: string;
}

export interface DBAuthProviderGoogleInstance extends DBBaseAuthProviderInstance, DBAuthProviderGoogleValue {
  type: typeof AuthProviderType.GOOGLE;
}

export const dbAuthProviderGoogleSchema = new Schema<DBAuthProviderGoogleInstance>(
  {
    ...dbBaseAuthProviderSchema.obj,
    type: {type: String, enum: [AuthProviderType.GOOGLE], required: true},
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
