import {Schema} from 'mongoose';
import {DBBaseAuthProviderInstance, DBBaseAuthProviderValue, dbBaseAuthProviderSchema} from './BaseAuthProvider.js';
import { AuthProviderType } from '../../../../../domain/authentication/entities/AuthProvider/types.js';

export interface DBFacebookAuthProviderValue extends DBBaseAuthProviderValue {
  type: typeof AuthProviderType.FACEBOOK;
  profileId: string;
}

export interface DBFacebookAuthProviderInstance extends DBFacebookAuthProviderValue, DBBaseAuthProviderInstance {
  type: typeof AuthProviderType.FACEBOOK;
}

export const dbFacebookAuthProviderSchema = new Schema<DBFacebookAuthProviderInstance>(
  {
    ...dbBaseAuthProviderSchema.obj,
    type: {type: String, enum: [AuthProviderType.FACEBOOK], required: true},
    profileId: {type: String, required: true},
  },
  {
    collection: 'authentication_authProviders',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);