import {RequestHandler} from 'express';
import {sendResponse} from '../../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';

export function infoController(): RequestHandler {
  return async (req, res) => {
    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, req.user);
  };
}
