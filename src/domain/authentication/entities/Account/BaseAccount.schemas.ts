import * as yup from 'yup';

export const BaseAccountSchemas = {
  type: yup.string(),
  providersId: yup.array().of(yup.string()),
  providers: yup.array().of(yup.mixed()),
  username: yup.string().min(1).max(255),
  profileImage: yup.string().max(2048),
} as const;
