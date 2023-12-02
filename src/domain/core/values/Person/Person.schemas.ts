import * as yup from 'yup';
import { isValid, parse } from 'date-fns';
import { Phone } from '../Phone/Phone.model.js';

export const PersonSchemas = {
  name: yup.string().max(255),
  middleName: yup.string().max(255),
  lastName: yup.string().max(255),
  secondLastName: yup.string().max(255),
  birthdate: yup.string().test('date-format-test', 'The format must be yyyy-MM-dd', (value) => {
    if (!value) {
      return true;
    }

    const asDate = parse(value, 'yyyy-MM-dd', new Date(Date.now()));

    return isValid(asDate);
  }),
  contactPhoneCreate: Phone._createValueSchema.default(undefined),
  contactPhoneUpdate: Phone._updateValueSchema.default(undefined),
} as const;