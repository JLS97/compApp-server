import * as yup from 'yup';
import {AppleAuthProviderSchema} from '../AppleAuthProvider/AppleAuthProvider.schemas.js';
import {BaseAuthProviderValues, BaseAuthProvider, BaseAuthProviderInstance} from '../BaseAuthProvider.model.js';
import { AuthProviderType } from '../types.js';
import { PartialDeep } from 'type-fest';

export interface AppleAuthProviderValues extends BaseAuthProviderValues {
  type: typeof AuthProviderType.APPLE;
  email: string;
}

export type AppleAuthProviderInstance = BaseAuthProviderInstance & AppleAuthProviderValues;

export class AppleAuthProvider extends BaseAuthProvider implements AppleAuthProviderInstance {
  type: typeof AuthProviderType.APPLE;
  email: string;

  static _updateValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAuthProvider._updateValueSchema.fields,
    type: AppleAuthProviderSchema.type,
    email: AppleAuthProviderSchema.email,
  });

  static _createValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAuthProvider._createValueSchema.fields,
    ...AppleAuthProvider._updateValueSchema.fields,
    type: AppleAuthProviderSchema.type.required(),
    email: AppleAuthProviderSchema.email.required(),
  });

  static _instanceSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAuthProvider._instanceSchema.fields,
    ...AppleAuthProvider._createValueSchema.fields,
  });

  constructor(params: PartialDeep<AppleAuthProviderInstance>) {
    super(params, AppleAuthProvider._instanceSchema);
    this.type = AuthProviderType.APPLE
  }

  isValidUpdateValue(): boolean {
    return super._isValidValue(AppleAuthProvider._updateValueSchema)
  }

  isValidCreateValue(): boolean {
    return super._isValidValue(AppleAuthProvider._createValueSchema)
  }

  isValidInstance(): boolean {
    return super._isValidValue(AppleAuthProvider._instanceSchema)
  }

  values<T = AppleAuthProviderValues>(): T {
    return super._values<T>(AppleAuthProvider._createValueSchema);
  }

  instanceValues<T = AppleAuthProviderInstance>(): T {
    return super._values<T>(AppleAuthProvider._instanceSchema);
  }
}