import * as yup from 'yup';

export const PushNotificationDevicesDeviceSchemas = {
  refId: yup.string().min(1).max(255),
  token: yup.string().trim(),
  tokens: yup.array().of(yup.string().trim()),
};
