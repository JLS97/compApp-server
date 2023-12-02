import * as yup from 'yup';

export const PhoneSchemas = {
  intlPrefix: yup.string().max(255),
  localNumber: yup.string().max(255),
} as const;