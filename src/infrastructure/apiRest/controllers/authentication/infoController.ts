import {RequestHandler} from 'express';
import {sendResponse} from '../../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';
import {toPublicAuthProvider} from '../../../../application/authentication/utils/toPublicAuthProvider.js';

export function infoController(): RequestHandler {
  return async (req, res) => {
    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, {
      accounts: req.user.accounts,
      provider: toPublicAuthProvider(req.user.provider),
    });
  };
}
