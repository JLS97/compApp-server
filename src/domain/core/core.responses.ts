/**
 * Algunos de los parámetros contienen valores incorrectos
 */
const InvalidRequest = {
  INVALID_REQUEST: 'INVALID_REQUEST',
} as const;

/**
 * Error genérico para indicar que ha existido un caso de error pero cuya naturaleza no tenemos tipificada
 */
const Unknown = {
  UNKNOWN: 'UNKNOWN',
} as const;

export const CoreResponses = {
  InvalidRequest,
  Unknown,
} as const;
