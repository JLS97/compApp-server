import * as yup from 'yup';

export const EntitySchemas = {
  id: yup.string().min(1).max(255),
  createdAt: yup.date(),
  updatedAt: yup.date(),
} as const;
