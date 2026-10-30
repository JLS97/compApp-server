import {Request, Response} from 'express';
import {AuthenticationService} from '../../../../application/authentication/authentication.service.js';
import {getPassport} from '../../../passport/passport.js';
import {AccessCredentials, AccessTokenPayload} from '../../../../domain/authentication/types.js';
import {sendResponse} from '../../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';
import {LoggerService} from '../../../../domain/logger/LoggerService.js';

interface ReturnAccessTokenParams {
  strategyName: string;
  authenticationService: AuthenticationService;
  accessTokenSecret: string;
  accessTokenExpiresInMs: number;
  refreshTokenExpiresInMs: number;
  onSuccess?: (res: Response, credentials: AccessCredentials) => void;
  loggerService?: LoggerService;
}

export function returnAccessTokenOAuth(params: ReturnAccessTokenParams) {
  return (req: Request<any, any, any, any, Record<string, any>>, res: Response<any, Record<string, any>>, next: any) => {
    const passport = getPassport();

    return passport.authenticate(params.strategyName, {session: false, prompt: 'select_account'}, async (error, user: AccessTokenPayload) => {
      /**
       * Passport no espera a este callback: si se escapase una excepción, sería una promesa rechazada sin manejar y Node cerraría el proceso
       */
      try {
        if (error) {
          params.loggerService?.error(error);
        }

        if (!user) {
          /**
           * Parece que en la primera llamada para recuperar el código (/apple) no hay cuenta y tiene que salirse del flujo
           * Si haces un redirect en este punto, falla la autenticación.
           * Si la respuesta aún no se ha enviado, la autenticación ha fallado de verdad y hay que responder para que la petición no se quede colgada
           */
          if (!res.headersSent) {
            sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST);
          }
          return;
        }

        const result = await params.authenticationService.generateCredentials(user.authProviderId, {
          accessTokenExpiresInMs: params.accessTokenExpiresInMs,
          accessTokenSecret: params.accessTokenSecret,
          refreshTokenExpiresInMs: params.refreshTokenExpiresInMs,
        });

        if (result.isFailure) {
          sendResponse(res, ServerResponseStatus.UNAUTHORIZED, ServerResponseCode.UNAUTHORIZED, result.failure);
          return;
        }

        params.onSuccess?.(res, result.success);
      } catch (_error) {
        params.loggerService?.error(_error);

        if (!res.headersSent) {
          sendResponse(res, ServerResponseStatus.INTERNAL_SERVER_ERROR, ServerResponseCode.INTERNAL_SERVER_ERROR);
        }
      }
    })(req, res, next);
  };
}
