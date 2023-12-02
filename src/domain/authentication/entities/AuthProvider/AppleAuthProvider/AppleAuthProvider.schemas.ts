import * as yup from 'yup';

export const AppleAuthProviderSchema = {
  type: yup.string().equals(['APPLE']),
  email: yup.string().email(),
};
