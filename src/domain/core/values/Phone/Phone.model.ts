import * as yup from 'yup';
import { ValueObject } from '../ValueObject/ValueObject.model.js';
import { PhoneSchemas } from './Phone.schemas.js';
import { PartialDeep } from 'type-fest';

export interface PhoneValues {
  intlPrefix: string;
  localNumber: string;
}

export class Phone extends ValueObject implements PhoneValues {
  intlPrefix: string;
  localNumber: string;

  static _updateValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    intlPrefix: PhoneSchemas.intlPrefix,
    localNumber: PhoneSchemas.localNumber,
  });

  static _createValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...Phone._updateValueSchema.fields,
    intlPrefix: PhoneSchemas.intlPrefix.required(),
    localNumber: PhoneSchemas.localNumber.required(),
  });

  constructor(params: PartialDeep<PhoneValues>) {
    super(params, Phone._createValueSchema);
  }

  isValidUpdateValue(): boolean {
    return super._isValidValue(Phone._updateValueSchema)
  }

  isValidCreateValue(): boolean {
    return super._isValidValue(Phone._createValueSchema)
  }

  values<T = PhoneValues>(): T {
    return super._values<T>(Phone._createValueSchema);
  }
}
