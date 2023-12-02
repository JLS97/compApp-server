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
      if (err) {
        params.loggerService?.error(err);
        sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, info.message);
        return;
      }

      if (!user) {
        sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, info.message);
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
    })(req, res, next);
  };
}
