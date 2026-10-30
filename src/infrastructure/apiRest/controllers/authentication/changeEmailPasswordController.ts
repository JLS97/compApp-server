import {RequestHandler} from 'express';
import {AuthenticationService} from '../../../../application/authentication/authentication.service.js';
import {sendResponse} from '../../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';

interface ChangeEmailPasswordControllerParams {
  authenticationService: AuthenticationService;
  accessTokenExpiresInMs: number;
  refreshTokenExpiresInMs: number;
  accessTokenSecret: string;
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

    /**
     * Al cambiar la contraseña se invalidan todos los refresh tokens del proveedor.
     * Se devuelven credenciales nuevas para que la sesión desde la que se ha cambiado siga activa. Si no se pueden generar, el cliente tendrá que volver a iniciar sesión
     */
    const credentialsResult = await params.authenticationService.generateCredentials(authProviderId, {
      accessTokenExpiresInMs: params.accessTokenExpiresInMs,
      accessTokenSecret: params.accessTokenSecret,
      refreshTokenExpiresInMs: params.refreshTokenExpiresInMs,
    });

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, credentialsResult.isSuccess ? credentialsResult.success : undefined);
  };
}
