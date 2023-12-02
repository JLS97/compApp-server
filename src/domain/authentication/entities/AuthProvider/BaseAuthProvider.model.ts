import * as yup from 'yup';
import {BaseAuthProviderSchema} from './BaseAuthProvider.schemas.js';
import { Entity, EntityValues } from '../../../core/entities/Entity/Entity.model.js';

export interface BaseAuthProviderValues {
  type: string;
}

export type BaseAuthProviderInstance = EntityValues & BaseAuthProviderValues;

export abstract class BaseAuthProvider extends Entity implements BaseAuthProviderInstance {
  type: string;

  static _updateValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    type: BaseAuthProviderSchema.type,
  });

  static _createValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAuthProvider._updateValueSchema.fields,
    type: BaseAuthProviderSchema.type.required(),
  });

  static _instanceSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...Entity._instanceSchema.fields,
    ...BaseAuthProvider._createValueSchema.fields,
  });
}
