import * as yup from 'yup';
import {GoogleAuthProviderSchema} from '../GoogleAuthProvider/GoogleAuthProvider.schemas.js';
import {BaseAuthProviderValues, BaseAuthProvider, BaseAuthProviderInstance} from '../BaseAuthProvider.model.js';
import { AuthProviderType } from '../types.js';
import { PartialDeep } from 'type-fest';

export interface GoogleAuthProviderValues extends BaseAuthProviderValues {
  type: typeof AuthProviderType.GOOGLE;
  email: string;
}

export type GoogleAuthProviderInstance = BaseAuthProviderInstance & GoogleAuthProviderValues;

export class GoogleAuthProvider extends BaseAuthProvider implements GoogleAuthProviderInstance {
  type: typeof AuthProviderType.GOOGLE;
  email: string;

  static _updateValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAuthProvider._updateValueSchema.fields,
    type: GoogleAuthProviderSchema.type,
    email: GoogleAuthProviderSchema.email,
  });

  static _createValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAuthProvider._createValueSchema.fields,
    ...GoogleAuthProvider._updateValueSchema.fields,
    type: GoogleAuthProviderSchema.type.required(),
    email: GoogleAuthProviderSchema.email.required(),
  });

  static _instanceSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAuthProvider._instanceSchema.fields,
    ...GoogleAuthProvider._createValueSchema.fields,
  });

  constructor(params: PartialDeep<GoogleAuthProviderInstance>) {
    super(params, GoogleAuthProvider._instanceSchema);
    this.type = AuthProviderType.GOOGLE
  }

  isValidUpdateValue(): boolean {
    return super._isValidValue(GoogleAuthProvider._updateValueSchema)
  }

  isValidCreateValue(): boolean {
    return super._isValidValue(GoogleAuthProvider._createValueSchema)
  }

  isValidInstance(): boolean {
    return super._isValidValue(GoogleAuthProvider._instanceSchema)
  }

  values<T = GoogleAuthProviderValues>(): T {
    return super._values<T>(GoogleAuthProvider._createValueSchema);
  }

  instanceValues<T = GoogleAuthProviderInstance>(): T {
    return super._values<T>(GoogleAuthProvider._instanceSchema);
  }
}
