import * as yup from 'yup';

export const ActivityEventSchemas = {
  type: yup.string(),
  isRead: yup.string(),
  receiverId: yup.string(),
  affectedId: yup.string(),
} as const;
