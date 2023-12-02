import {NextFunction, Request, Response} from 'express';
import {sendResponse} from '../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../types.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';

export function errorHandler(cb: (req: Request, res: Response, next: NextFunction) => Promise<void> | void, loggerService?: LoggerService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
      return;
    } catch (error) {
      loggerService?.error(error);
      sendResponse(res, ServerResponseStatus.INTERNAL_SERVER_ERROR, ServerResponseCode.INTERNAL_SERVER_ERROR);
      return;
    }
  };
}
