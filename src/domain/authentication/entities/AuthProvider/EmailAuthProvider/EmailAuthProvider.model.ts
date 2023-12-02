import * as yup from 'yup';
import {EmailAuthProviderSchema} from '../EmailAuthProvider/EmailAuthProvider.schemas.js';
import {BaseAuthProviderValues, BaseAuthProvider, BaseAuthProviderInstance} from '../BaseAuthProvider.model.js';
import { AuthProviderType } from '../types.js';
import { PartialDeep } from 'type-fest';

export interface EmailAuthProviderValues extends BaseAuthProviderValues {
  type: typeof AuthProviderType.EMAIL;
  email: string;
  password: string;
  resetPasswordCode?: string;
  resetPasswordCodeExpiresAt?: Date;
}

export type EmailAuthProviderInstance = BaseAuthProviderInstance & EmailAuthProviderValues;

export class EmailAuthProvider extends BaseAuthProvider implements EmailAuthProviderInstance {
  type: typeof AuthProviderType.EMAIL;
  email: string;
  password: string;
  resetPasswordCode?: string;
  resetPasswordCodeExpiresAt?: Date;

  static _updateValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAuthProvider._updateValueSchema.fields,
    type: EmailAuthProviderSchema.type,
    email: EmailAuthProviderSchema.email,
    password: EmailAuthProviderSchema.password,
    resetPasswordCode: EmailAuthProviderSchema.resetPasswordCode,
    resetPasswordCodeExpiresAt: EmailAuthProviderSchema.resetPasswordCodeExpiresAt,
  });

  static _createValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAuthProvider._createValueSchema.fields,
    ...EmailAuthProvider._updateValueSchema.fields,
    type: EmailAuthProviderSchema.type.required(),
    email: EmailAuthProviderSchema.email.required(),
    password: EmailAuthProviderSchema.password.required(),
  });

  static _instanceSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAuthProvider._instanceSchema.fields,
    ...EmailAuthProvider._createValueSchema.fields,
  });

  constructor(params: PartialDeep<EmailAuthProviderInstance>) {
    super(params, EmailAuthProvider._instanceSchema);
    this.type = AuthProviderType.EMAIL
  }

  isValidUpdateValue(): boolean {
    return super._isValidValue(EmailAuthProvider._updateValueSchema)
  }

  isValidCreateValue(): boolean {
    return super._isValidValue(EmailAuthProvider._createValueSchema)
  }

  isValidInstance(): boolean {
    return super._isValidValue(EmailAuthProvider._instanceSchema)
  }

  values<T = EmailAuthProviderValues>(): T {
    return super._values<T>(EmailAuthProvider._createValueSchema);
  }

  instanceValues<T = EmailAuthProviderInstance>(): T {
    return super._values<T>(EmailAuthProvider._instanceSchema);
  }
}