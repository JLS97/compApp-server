import {Schema} from 'mongoose';
import { AccountType } from '../../../../../domain/authentication/entities/Account/types.js';
import { DBBaseAccountInstance, DBBaseAccountValue, dbBaseAccountSchema } from './BaseAccountDBModel.js';

export interface DBPersonalAccountValue extends DBBaseAccountValue {
  type: typeof AccountType.PERSONAL;
}

export interface DBPersonalAccountInstance extends DBBaseAccountInstance, DBPersonalAccountValue {
  type: typeof AccountType.PERSONAL;
}

export const dbPersonalAccountSchema = new Schema<DBPersonalAccountInstance>(
  {
    ...dbBaseAccountSchema.obj,
    type: {type: String, enum: [AccountType.PERSONAL], required: true},
  },
  {
    collection: 'authentication_accounts',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);
