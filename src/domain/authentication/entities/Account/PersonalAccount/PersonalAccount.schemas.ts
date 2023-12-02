import * as yup from 'yup';
import { AccountType } from '../types.js';

export const PersonalAccountSchemas = {
  type: yup.string().equals([AccountType.PERSONAL]),
} as const;
