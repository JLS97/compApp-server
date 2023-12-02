import {Schema} from 'mongoose';
import { AccountType } from '../../../../../domain/authentication/entities/Account/types.js';
import { DBBaseAccountInstance, DBBaseAccountValue, dbBaseAccountSchema } from './BaseAccountDBModel.js';

export interface DBAdminAccountValue extends DBBaseAccountValue {
  type: typeof AccountType.ADMIN;
}

export interface DBAdminAccountInstance extends DBBaseAccountInstance, DBAdminAccountValue {
  type: typeof AccountType.ADMIN;
}

export const dbAdminAccountSchema = new Schema<DBAdminAccountInstance>(
  {
    ...dbBaseAccountSchema.obj,
    type: {type: String, enum: [AccountType.ADMIN], required: true},
  },
  {
    collection: 'authentication_accounts',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);
