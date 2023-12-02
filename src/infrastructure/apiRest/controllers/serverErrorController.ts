import {ErrorRequestHandler} from 'express';
import {sendResponse} from '../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../types.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';

export function serverErrorController(loggerService?: LoggerService): ErrorRequestHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars --- Es necesario incluir el parámetro next porque, si no, no se activa el handler
  return (err, _, res, next) => {
    loggerService?.error(err);
    sendResponse(res, ServerResponseStatus.INTERNAL_SERVER_ERROR, ServerResponseCode.INTERNAL_SERVER_ERROR);
  };
}
