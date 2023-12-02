import * as yup from 'yup';

/**
 * Comprueba si una instancia u objeto tiene las claves necesarias para pasar una validación
 * @param evalObj Objeto a evaluar
 * @param schema Esquema de validación
 * @returns true si el objeto es válido
 */
export const hasValidProperties = <T>(evalObj: T, schema: yup.Schema): boolean => {
  const newObj = {};
  for (const name of Object.getOwnPropertyNames(evalObj)) {
    newObj[name] = evalObj[name];
  }

  return schema.isValidSync(newObj);
};
