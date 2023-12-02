import * as yup from 'yup';
import { AccountType } from '../types.js';

export const AdminAccountSchemas = {
  type: yup.string().equals([AccountType.ADMIN]),
} as const;
