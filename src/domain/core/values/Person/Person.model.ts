import * as yup from 'yup';
import { PhoneValues } from '../Phone/Phone.model.js';
import { PersonSchemas } from './Person.schemas.js';
import { ValueObject } from '../ValueObject/ValueObject.model.js';
import { PartialDeep } from 'type-fest';

export interface PersonValues {
  name?: string;
  middleName?: string;
  lastName?: string;
  secondLastName?: string;
  birthdate?: string;
  phone?: PhoneValues;
}

export class Person extends ValueObject implements PersonValues {
  name?: string;
  middleName?: string;
  lastName?: string;
  secondLastName?: string;
  birthdate?: string;
  phone?: PhoneValues;

  static _updateValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    name: PersonSchemas.name,
    middleName: PersonSchemas.middleName,
    lastName: PersonSchemas.lastName,
    secondLastName: PersonSchemas.secondLastName,
    birthdate: PersonSchemas.birthdate,
    phone: PersonSchemas.contactPhoneUpdate,
  });

  static _createValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...Person._updateValueSchema.fields,
    phone: PersonSchemas.contactPhoneCreate,
  });

  constructor(params: PartialDeep<PersonValues>) {
    super(params, Person._createValueSchema);
  }

  isValidUpdateValue(): boolean {
    return super._isValidValue(Person._updateValueSchema)
  }

  isValidCreateValue(): boolean {
    return super._isValidValue(Person._createValueSchema)
  }

  values<T = PersonValues>(): T {
    return super._values<T>(Person._createValueSchema);
  }
}
