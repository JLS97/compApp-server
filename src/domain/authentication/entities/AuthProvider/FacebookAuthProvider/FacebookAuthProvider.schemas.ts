import * as yup from 'yup';

export const FacebookAuthProviderSchema = {
  type: yup.string().equals(['FACEBOOK']),
  profileId: yup.string().max(255),
};
