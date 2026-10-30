import {Request, Response} from 'express';
import {AuthenticationService} from '../../../../application/authentication/authentication.service.js';
import {sendResponse} from '../../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';
import {getPassport} from '../../../passport/passport.js';
import {LoggerService} from '../../../../domain/logger/LoggerService.js';

export interface ReturnAccessTokenParams {
  authenticationService: AuthenticationService;
  accessTokenSecret: string;
  accessTokenExpiresInMs: number;
  refreshTokenExpiresInMs: number;
  loggerService?: LoggerService;
}

export function returnAccessToken(params: ReturnAccessTokenParams) {
  return (req: Request<any, any, any, any, Record<string, any>>, res: Response<any, Record<string, any>>, next: any) => {
    const passport = getPassport();

    return passport.authenticate('local', {session: false}, async (err, user, info) => {
      /**
       * Passport no espera a este callback: si se escapase una excepción, sería una promesa rechazada sin manejar y Node cerraría el proceso
       */
      try {
        // Cuando la estrategia lanza un error, passport no envía info
        if (err) {
          params.loggerService?.error(err);
          sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, info?.message);
          return;
        }

        if (!user) {
          sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, info?.message);
          return;
        }

        const result = await params.authenticationService.generateCredentials(user.provider.id, {
          accessTokenExpiresInMs: params.accessTokenExpiresInMs,
          accessTokenSecret: params.accessTokenSecret,
          refreshTokenExpiresInMs: params.refreshTokenExpiresInMs,
        });

        if (result.isFailure) {
          sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
          return;
        }

        sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success);
      } catch (_error) {
        params.loggerService?.error(_error);

        if (!res.headersSent) {
          sendResponse(res, ServerResponseStatus.INTERNAL_SERVER_ERROR, ServerResponseCode.INTERNAL_SERVER_ERROR);
        }
      }
    })(req, res, next);
  };
}
