import {RequestHandler} from 'express';
import {AuthenticationService} from '../../../../application/authentication/authentication.service.js';
import {sendResponse} from '../../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';
import {AccountType} from '../../../../domain/authentication/entities/Account/types.js';

interface CreateAccountControllerParams {
  authenticationService: AuthenticationService;
}

export function createAccountController(params: CreateAccountControllerParams): RequestHandler {
  return async (req, res) => {
    const {username, profileImage} = req.body;

    /**
     * El tipo se fija en el servidor para que un cliente nunca pueda crearse una cuenta de administrador
     */
    const result = await params.authenticationService.createAccount({
      type: AccountType.PERSONAL,
      username,
      profileImage,
      providersId: [req.user.provider.id],
    });

    if (result.isFailure) {
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.CREATED, ServerResponseCode.SUCCESS, result.success);
  };
}
