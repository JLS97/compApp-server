import * as yup from 'yup';
import { hasValidProperties } from '../../utils/hasValidProperties.js';
import { getProperties } from '../../utils/getProperties.js';
import { PartialDeep } from 'type-fest';
import { onlyKnownProperties } from '../../utils/onlyKnownProperties.js';

export abstract class ValueObject {
  constructor(params: PartialDeep<unknown>, schema: yup.ObjectSchema<unknown>){
    onlyKnownProperties<ValueObject, PartialDeep<ValueObject>>(this, params, schema);
  }

  /**
   * Devuelve true si los valores que contiene el objeto-valor son válidos para actualizar un objeto de este tipo
   */
  abstract isValidUpdateValue(schema: yup.ObjectSchema<unknown>): boolean;

  /**
   * Devuelve true si los valores que contiene el objeto-valor son válidos para crear un objeto de este tipo
   */
  abstract isValidCreateValue(schema: yup.ObjectSchema<unknown>): boolean;

  /**
   * Devuelve los datos que contiene el objeto-valor
   */
  abstract values<T = ValueObject>(schema: yup.ObjectSchema<unknown>): T;

  /**
   * Devuelve true si los valores a actualizar que contiene el objeto-valor son válidos según el esquema proporcionado
   */
  protected _isValidValue(schema: yup.ObjectSchema<unknown>): boolean {
    return hasValidProperties(this, schema);
  }

  /**
   * Devuelve los datos que contiene el objeto-valor
   */
  protected _values<T = ValueObject>(schema: yup.ObjectSchema<unknown>): T {
    return getProperties<ValueObject, T>(this, schema);
  }
}
