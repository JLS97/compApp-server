import {RequestHandler} from 'express';
import {sendResponse} from '../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../types.js';

export function healthCheckController(): RequestHandler {
  return (_, res) => {
    const currentServerTime = new Date(Date.now()).toISOString();

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, {
      currentTime: currentServerTime,
    });
  };
}
