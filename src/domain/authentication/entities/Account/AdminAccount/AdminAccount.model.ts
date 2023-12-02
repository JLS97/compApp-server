import * as yup from 'yup';
import { PartialDeep } from 'type-fest';
import { BaseAccount, BaseAccountInstance, BaseAccountValues } from '../BaseAccount.model.js';
import { AccountType } from '../types.js';
import { AdminAccountSchemas } from './AdminAccount.schemas.js';

export interface AdminAccountValues extends BaseAccountValues {
  type: typeof AccountType.ADMIN,
}

export type AdminAccountInstance = BaseAccountInstance & AdminAccountValues;

export class AdminAccount extends BaseAccount implements AdminAccountInstance {
  type: typeof AccountType.ADMIN;

  static _updateValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAccount._updateValueSchema.fields,
    type: AdminAccountSchemas.type,
  });

  static _createValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAccount._createValueSchema.fields,
    ...AdminAccount._updateValueSchema.fields,
    type: AdminAccountSchemas.type.required(),
  });

  static _instanceSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAccount._instanceSchema.fields,
    ...AdminAccount._createValueSchema.fields,
  });

  constructor(params: PartialDeep<AdminAccountInstance>) {
    super(params, AdminAccount._instanceSchema);
    this.type = AccountType.ADMIN;
  }

  isValidUpdateValue(): boolean {
    return super._isValidValue(AdminAccount._updateValueSchema)
  }

  isValidCreateValue(): boolean {
    return super._isValidValue(AdminAccount._createValueSchema)
  }

  isValidInstance(): boolean {
    return super._isValidValue(AdminAccount._instanceSchema)
  }

  values<T = AdminAccountValues>(): T {
    return super._values<T>(AdminAccount._createValueSchema);
  }

  instanceValues<T = AdminAccountInstance>(): T {
    return super._values<T>(AdminAccount._instanceSchema);
  }
}
