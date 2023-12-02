import {Schema} from 'mongoose';
import {DBBaseAuthProviderInstance, DBBaseAuthProviderValue, dbBaseAuthProviderSchema} from './BaseAuthProvider.js';
import { AuthProviderType } from '../../../../../domain/authentication/entities/AuthProvider/types.js';

export interface DBEmailAuthProviderValue extends DBBaseAuthProviderValue {
  type: typeof AuthProviderType.EMAIL;
  email: string;
  password: string;
  resetPasswordCode?: string;
  resetPasswordCodeExpiresAt?: Date;
  requiresResetPasswordFromLegacy?: boolean;
}

export interface DBEmailAuthProviderInstance extends DBEmailAuthProviderValue, DBBaseAuthProviderInstance {
  type: typeof AuthProviderType.EMAIL;
}

export const dbEmailAuthProviderSchema = new Schema<DBEmailAuthProviderInstance>(
  {
    ...dbBaseAuthProviderSchema.obj,
    type: {type: String, enum: [AuthProviderType.EMAIL], required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    resetPasswordCode: {type: String, required: false},
    resetPasswordCodeExpiresAt: {type: Date, required: false},
    requiresResetPasswordFromLegacy: {type: Boolean, required: false},
  },
  {
    collection: 'authentication_authProviders',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);
