import {NextFunction, Request, Response} from 'express';
import {sendResponse} from '../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../types.js';

export function isFeaturedEnabled(feature: boolean) {
  return async (_: Request, res: Response, next: NextFunction) => {
    if (!feature) {
      sendResponse(res, ServerResponseStatus.LOCKED, ServerResponseCode.NOT_IMPLEMENTED);
      return;
    }

    next();
  };
}
