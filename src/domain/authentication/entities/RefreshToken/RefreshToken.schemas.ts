import * as yup from 'yup';

export const RefreshTokenSchemas = {
  authProviderId: yup.string(),
  expiresAt: yup.date(),
  isValid: yup.boolean(),
} as const;
