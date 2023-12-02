import * as yup from 'yup';
import {cleanObject} from './cleanObject.js';

/**
 * Recupera un objeto con las propiedades que estén dentro del esquema
 */
export const getProperties = <T, P>(objRef: T, schema: yup.ObjectSchema<any>): P => {
  const filteredObject = cleanObject.call(objRef, objRef, Object.keys(schema.fields));

  return filteredObject as P;
};
