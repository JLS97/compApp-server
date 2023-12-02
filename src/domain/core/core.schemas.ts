import * as yup from 'yup';

export const CoreSchemas = {
  id: yup.string().min(1).max(255),
  createdAt: yup.date(),
  updatedAt: yup.date(),
  page: yup.number().min(1),
  pageSize: yup.number().min(1).max(500),
};
