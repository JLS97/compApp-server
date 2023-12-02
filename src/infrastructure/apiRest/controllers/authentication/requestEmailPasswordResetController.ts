import {RequestHandler} from 'express';
import {AuthenticationService} from '../../../../application/authentication/authentication.service.js';
import {sendResponse} from '../../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';

interface RequestEmailPasswordResetControllerParams {
  authenticationService: AuthenticationService;
}

export function requestEmailPasswordResetController(params: RequestEmailPasswordResetControllerParams): RequestHandler {
  return async (req, res) => {
    const {email} = req.body;

    const result = await params.authenticationService.requestPasswordResetEmail(email);

    if (result.isFailure) {
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success);
  };
}
