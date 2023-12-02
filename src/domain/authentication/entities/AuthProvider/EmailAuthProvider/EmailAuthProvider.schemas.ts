import * as yup from 'yup';

export const EmailAuthProviderSchema = {
  type: yup.string().equals(['EMAIL']),
  email: yup.string().email(),
  password: yup.string().max(255),
  resetPasswordCode: yup.string().max(255),
  resetPasswordCodeExpiresAt: yup.date(),
};
