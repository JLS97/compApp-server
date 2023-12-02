import * as yup from 'yup';
import {RefreshTokenSchemas} from './RefreshToken.schemas.js';
import {BaseAuthProviderInstance} from '../AuthProvider/BaseAuthProvider.model.js';
import { Entity, EntityValues } from '../../../core/entities/Entity/Entity.model.js';
import { PartialDeep } from 'type-fest';

export interface RefreshTokenValues {
  authProviderId: string;
  expiresAt: Date;
  isValid: boolean;
}

export type RefreshTokenInstance = EntityValues & RefreshTokenValues & {
  authProvider?: BaseAuthProviderInstance;
}

export class RefreshToken extends Entity implements RefreshTokenInstance {
  authProviderId: string;
  authProvider?: BaseAuthProviderInstance;
  expiresAt: Date;
  isValid: boolean;

  static _updateValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    authProviderId: RefreshTokenSchemas.authProviderId,
    expiresAt: RefreshTokenSchemas.expiresAt,
    isValid: RefreshTokenSchemas.isValid,
  });
  
  static _createValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...RefreshToken._updateValueSchema.fields,
    authProviderId: RefreshTokenSchemas.authProviderId.required(),
    expiresAt: RefreshTokenSchemas.expiresAt.required(),
    isValid: RefreshTokenSchemas.isValid.required(),
  });

  static _instanceSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...Entity._instanceSchema.fields,
    ...RefreshToken._createValueSchema.fields,
  });

  constructor(params: PartialDeep<RefreshTokenInstance>) {
    super(params, RefreshToken._instanceSchema);
  }

  isValidUpdateValue(): boolean {
    return super._isValidValue(RefreshToken._updateValueSchema)
  }

  isValidCreateValue(): boolean {
    return super._isValidValue(RefreshToken._createValueSchema)
  }

  isValidInstance(): boolean {
    return super._isValidValue(RefreshToken._instanceSchema)
  }

  values<T = RefreshTokenValues>(): T {
    return super._values<T>(RefreshToken._createValueSchema);
  }

  instanceValues<T = RefreshTokenInstance>(): T {
    return super._values<T>(RefreshToken._instanceSchema);
  }
}
