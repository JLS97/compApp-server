import * as yup from 'yup';

export const BaseAccountSchemas = {
  type: yup.string(),
  providersId: yup.array().of(yup.string()),
  providers: yup.array().of(yup.mixed()),
} as const;
