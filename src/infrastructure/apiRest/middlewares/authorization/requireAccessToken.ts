import {Request, Response} from 'express';
import {AuthenticatedUser} from '../../../../domain/authentication/types.js';
import {getPassport} from '../../../passport/passport.js';
import {sendResponse} from '../../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';
import { LoggerService } from '../../../../domain/logger/LoggerService.js';

export interface RequireAccessTokenParams {
  loggerService?: LoggerService
}

export function requireAccessToken(params?: RequireAccessTokenParams) {
  return (
    req: Request<any, any, any, any, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: any
  ): asserts req is Request & {user: AuthenticatedUser} => {
    const passport = getPassport();

    return passport.authenticate('jwt', {session: false}, (err, user: Required<Express.Request['user']>) => {
      if (err) {
        params?.loggerService?.error(requireAccessToken.name, err);
        sendResponse(res, ServerResponseStatus.UNAUTHORIZED, ServerResponseCode.UNAUTHORIZED);
        return;
      }

      if (!user) {
        sendResponse(res, ServerResponseStatus.UNAUTHORIZED, ServerResponseCode.UNAUTHORIZED);
        return;
      }

      // @ts-ignore
      req.user = user;

      return next(null, user);
    })(req, res, next);
  };
}
