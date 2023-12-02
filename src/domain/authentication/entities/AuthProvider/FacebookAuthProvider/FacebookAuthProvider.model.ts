import * as yup from 'yup';
import {FacebookAuthProviderSchema} from '../FacebookAuthProvider/FacebookAuthProvider.schemas.js';
import {BaseAuthProviderValues, BaseAuthProvider, BaseAuthProviderInstance} from '../BaseAuthProvider.model.js';
import { AuthProviderType } from '../types.js';
import { PartialDeep } from 'type-fest';

export interface FacebookAuthProviderValues extends BaseAuthProviderValues {
  type: typeof AuthProviderType.FACEBOOK;
  profileId: string;
}

export type FacebookAuthProviderInstance = BaseAuthProviderInstance & FacebookAuthProviderValues;

export class FacebookAuthProvider extends BaseAuthProvider implements FacebookAuthProviderInstance {
  type: typeof AuthProviderType.FACEBOOK;
  profileId: string;

  static _updateValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAuthProvider._updateValueSchema.fields,
    type: FacebookAuthProviderSchema.type,
    profileId: FacebookAuthProviderSchema.profileId,
  });

  static _createValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAuthProvider._createValueSchema.fields,
    ...FacebookAuthProvider._updateValueSchema.fields,
    type: FacebookAuthProviderSchema.type.required(),
    profileId: FacebookAuthProviderSchema.profileId.required(),
  });

  static _instanceSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAuthProvider._instanceSchema.fields,
    ...FacebookAuthProvider._createValueSchema.fields,
  });

  constructor(params: PartialDeep<FacebookAuthProviderInstance>) {
    super(params, FacebookAuthProvider._instanceSchema);
    this.type = AuthProviderType.FACEBOOK
  }

  isValidUpdateValue(): boolean {
    return super._isValidValue(FacebookAuthProvider._updateValueSchema)
  }

  isValidCreateValue(): boolean {
    return super._isValidValue(FacebookAuthProvider._createValueSchema)
  }

  isValidInstance(): boolean {
    return super._isValidValue(FacebookAuthProvider._instanceSchema)
  }

  values<T = FacebookAuthProviderValues>(): T {
    return super._values<T>(FacebookAuthProvider._createValueSchema);
  }

  instanceValues<T = FacebookAuthProviderInstance>(): T {
    return super._values<T>(FacebookAuthProvider._instanceSchema);
  }
}
