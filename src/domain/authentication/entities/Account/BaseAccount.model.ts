import * as yup from 'yup';
import { Entity, EntityValues } from '../../../core/entities/Entity/Entity.model.js';
import { BaseAuthProviderInstance } from '../AuthProvider/BaseAuthProvider.model.js';
import { BaseAccountSchemas } from './BaseAccount.schemas.js';

export interface BaseAccountValues {
  type: string;
  providersId: string[];
  username: string;
  profileImage?: string;
}

export type BaseAccountInstance = EntityValues & BaseAccountValues & {
  providers?: BaseAuthProviderInstance[];
}

export abstract class BaseAccount extends Entity implements BaseAccountInstance {
  type: string;
  providersId: string[];
  username: string;
  profileImage?: string;
  providers?: BaseAuthProviderInstance[];

  static _updateValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    providersId: BaseAccountSchemas.providersId,
  });

  static _createValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...BaseAccount._updateValueSchema.fields,
    providersId: BaseAccountSchemas.providersId.required(),
  });

  static _instanceSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...Entity._instanceSchema.fields,
    ...BaseAccount._createValueSchema.fields,
    providers: BaseAccountSchemas.providers,
  });
}
