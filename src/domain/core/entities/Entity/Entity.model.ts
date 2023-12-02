import * as yup from 'yup';
import { ValueObject } from "../../values/ValueObject/ValueObject.model.js";
import { EntitySchemas } from './Entity.schemas.js';

export interface EntityValues {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class Entity extends ValueObject implements EntityValues {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  static _instanceSchema: yup.ObjectSchema<any> = yup.object().shape({
    id: EntitySchemas.id.required(),
    createdAt: EntitySchemas.createdAt.required(),
    updatedAt: EntitySchemas.updatedAt.required(),
  }) as any;

  /**
   * Devuelve true si los valores de la instancia son válidos
   */
  abstract isValidInstance(schema: yup.ObjectSchema<unknown>): boolean;

  /**
   * Devuelve los datos que contiene la instancia
   */
  abstract instanceValues(schema: yup.ObjectSchema<unknown>): unknown;
}
