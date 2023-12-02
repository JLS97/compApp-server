import {RequestHandler} from 'express';
import {AuthenticationService} from '../../../../application/authentication/authentication.service.js';
import {sendResponse} from '../../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';

interface ChangeEmailPasswordControllerParams {
  authenticationService: AuthenticationService;
}

export function changeEmailPasswordController(params: ChangeEmailPasswordControllerParams): RequestHandler {
  return async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    const authProviderId = req.user.provider.id;

    const result = await params.authenticationService.changeEmailProviderPassword(authProviderId, oldPassword, newPassword);

    if (result.isFailure) {
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success);
  };
}
