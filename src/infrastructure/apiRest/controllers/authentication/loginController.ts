import {RequestHandler} from 'express';
import {AuthenticationService} from '../../../../application/authentication/authentication.service.js';
import {returnAccessToken} from '../../middlewares/authentication/returnAccessToken.js';
import {LoggerService} from '../../../../domain/logger/LoggerService.js';

interface LoginControllerParams {
  authenticationService: AuthenticationService;
  accessTokenExpiresInMs: number;
  refreshTokenExpiresInMs: number;
  accessTokenSecret: string;
  loggerService?: LoggerService;
}

export function loginController(params: LoginControllerParams): RequestHandler {
  return async (req, res, next) => {
    return returnAccessToken({
      authenticationService: params.authenticationService,
      accessTokenExpiresInMs: params.accessTokenExpiresInMs,
      accessTokenSecret: params.accessTokenSecret,
      refreshTokenExpiresInMs: params.refreshTokenExpiresInMs,
      loggerService: params.loggerService,
    })(req, res, next);
  };
}
