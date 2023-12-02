import * as yup from 'yup';
import { PartialDeep } from 'type-fest';
import { BaseAccount, BaseAccountInstance, BaseAccountValues } from '../BaseAccount.model.js';
import { AccountType } from '../types.js';
import { PersonalAccountSchemas } from './PersonalAccount.schemas.js';

export interface PersonalAccountValues extends BaseAccountValues {
  type: typeof AccountType.PERSONAL,
}

export type PersonalAccountInstance = BaseAccountInstance & PersonalAccountValues;

export class PersonalAccount extends BaseAccount implements PersonalAccountInstance {
  type: typeof AccountType.PERSONAL;

  static _updateValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAccount._updateValueSchema.fields,
    type: PersonalAccountSchemas.type,
  });

  static _createValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAccount._createValueSchema.fields,
    ...PersonalAccount._updateValueSchema.fields,
    type: PersonalAccountSchemas.type.required(),
  });

  static _instanceSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAccount._instanceSchema.fields,
    ...PersonalAccount._createValueSchema.fields,
  });

  constructor(params: PartialDeep<PersonalAccountInstance>) {
    super(params, PersonalAccount._instanceSchema);
    this.type = AccountType.PERSONAL;
  }

  isValidUpdateValue(): boolean {
    return super._isValidValue(PersonalAccount._updateValueSchema)
  }

  isValidCreateValue(): boolean {
    return super._isValidValue(PersonalAccount._createValueSchema)
  }

  isValidInstance(): boolean {
    return super._isValidValue(PersonalAccount._instanceSchema)
  }

  values<T = PersonalAccountValues>(): T {
    return super._values<T>(PersonalAccount._createValueSchema);
  }

  instanceValues<T = PersonalAccountInstance>(): T {
    return super._values<T>(PersonalAccount._instanceSchema);
  }
}
