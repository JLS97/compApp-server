import {rateLimit} from 'express-rate-limit';
import {sendResponse} from '../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../types.js';

export interface RateLimiterParams {
  windowMs: number;
  maxRequests: number;
}

/**
 * Limita el número de peticiones por IP dentro de una ventana de tiempo. Cada instancia lleva su propio contador, compartido por todas las rutas en las que se use.
 * Los contadores se guardan en memoria: si hay varias instancias del servidor, cada una cuenta por separado
 * @param params.windowMs Duración de la ventana en milisegundos
 * @param params.maxRequests Número máximo de peticiones por IP dentro de la ventana
 */
export function rateLimiter(params: RateLimiterParams) {
  return rateLimit({
    windowMs: params.windowMs,
    limit: params.maxRequests,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_, res) => {
      sendResponse(res, ServerResponseStatus.TOO_MANY_REQUESTS, ServerResponseCode.TOO_MANY_REQUESTS);
    },
  });
}
