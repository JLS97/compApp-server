import {RequestHandler} from 'express';
import {sendResponse} from '../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../types.js';

export function routeNotFoundController(): RequestHandler {
  return (_, res) => {
    sendResponse(res, ServerResponseStatus.NOT_FOUND, ServerResponseCode.ROUTE_NOT_FOUND);
  };
}
