import * as yup from 'yup';

export const GoogleAuthProviderSchema = {
  type: yup.string().equals(['GOOGLE']),
  email: yup.string().email(),
};
