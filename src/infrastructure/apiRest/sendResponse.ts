import {Response} from 'express';

/**
 * Envía una respuesta JSON de servidor con un formato predeterminado.
 * Una vez se invoque esta función no se deben volver a enviar los headers posteriormente (res.status(...).json(...))
 * @param res Objecto Response de express
 * @param status Estado HTTP que se enviará
 * @param code Estado principal de la petición
 * @param payload Información adicional sobre la respuesta de la petición
 */
export function sendResponse<T = undefined>(res: Response, status: number, code: string, payload?: T): void {
  res.status(status).json({
    code,
    payload,
  });
}
