/**
 * Se eliminan todas aquellas propiedades del objeto de origen que no estén dentro de las claves dentro de la lista blanca
 */
export const cleanObject = <T>(obj: T, keys: string[]): T => {
  const objectProperties = Object.keys(obj) as Array<keyof T>;

  objectProperties.forEach((property) => {
    if (typeof property === 'string' && !keys.includes(property)) {
      delete obj[property];
    }
  });

  return obj;
};
