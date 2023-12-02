import {Document, Schema} from 'mongoose';
import {RefreshToken, RefreshTokenInstance, RefreshTokenValues} from '../../../../../domain/authentication/entities/RefreshToken/RefreshToken.model.js';
import {DBBaseAuthProviderInstance, DBAuthProviderToItem} from '../authProvider/BaseAuthProvider.js';

export interface DBRefreshTokenValue {
  authProviderId: string;
  expiresAt: Date;
  isValid: boolean;
}

export interface DBRefreshTokenInstance extends DBRefreshTokenValue {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const dbRefreshTokenSchema = new Schema<DBRefreshTokenInstance>(
  {
    id: {type: String, required: true, unique: true},
    authProviderId: {type: String, required: true},
    expiresAt: {type: Date, required: true},
    isValid: {type: Boolean, required: true},
  },
  {
    collection: 'authentication_refreshTokens',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

export const RefreshTokenVirtuals = {
  authProvider: 'authProvider',
} as const;
export type RefreshTokenVirtuals = (typeof RefreshTokenVirtuals)[keyof typeof RefreshTokenVirtuals];

dbRefreshTokenSchema.virtual(RefreshTokenVirtuals.authProvider, {
  ref: 'AuthProvider',
  localField: 'authProviderId',
  foreignField: 'id',
  justOne: true,
});

export function DBRefreshTokenToItem(dbItem: RefreshTokenValues & Document & {authProvider?: DBBaseAuthProviderInstance & Document}): RefreshToken {
  return new RefreshToken({
    ...dbItem.toJSON(),
    authProvider: dbItem.authProvider ? DBAuthProviderToItem(dbItem.authProvider) : undefined,
  });
}

export function RefreshTokenValueToDBItem(item: RefreshTokenValues): DBRefreshTokenValue {
  const candidate = new RefreshToken(item);
  return {
    ...candidate.values(),
  };
}

export function RefreshTokenInstanceToDBItem(item: RefreshTokenInstance): DBRefreshTokenInstance {
  const candidate = new RefreshToken(item);
  return {
    ...candidate.instanceValues(),
  };
}
