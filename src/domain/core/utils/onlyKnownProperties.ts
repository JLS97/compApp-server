import * as yup from 'yup';
import {cleanObject} from './cleanObject.js';

/**
 * Solo aquellas propiedades que existan en el esquema del modelo serán las que se guardarán en el objeto de origen
 * @param objRef Objeto a sobreescribir
 * @param params Parámetros de entrada
 * @param schema Esquema de validación
 */
export const onlyKnownProperties = <T, P>(objRef: T, params: P, schema: yup.ObjectSchema<any>): void => {
  const filteredObject = cleanObject.call(objRef, params, Object.keys(schema.fields));

  for (const prop in filteredObject) {
    if (Object.prototype.hasOwnProperty.call(filteredObject, prop)) {
      objRef[prop] = filteredObject[prop];
    }
  }
};
