import {RequestHandler} from 'express';
import {AuthenticationService} from '../../../../application/authentication/authentication.service.js';
import {sendResponse} from '../../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';

interface ChangeEmailPasswordByCodeControllerParams {
  authenticationService: AuthenticationService;
}

export function changeEmailPasswordByCodeController(params: ChangeEmailPasswordByCodeControllerParams): RequestHandler {
  return async (req, res) => {
    const {authProviderId, code, newPassword} = req.body;

    const result = await params.authenticationService.changeEmailProviderPasswordByCode(authProviderId, code, newPassword);

    if (result.isFailure) {
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success);
  };
}
