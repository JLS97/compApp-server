import {RequestHandler, Response} from 'express';
import {returnAccessTokenOAuth} from '../../middlewares/authentication/returnAccessTokenOAuth.js';
import {LoggerService} from '../../../../domain/logger/LoggerService.js';
import {AuthenticationService} from '../../../../application/authentication/authentication.service.js';
import {AccessCredentials} from '../../../../domain/authentication/types.js';

interface GoogleControllerParams {
  accessTokenExpiresInMs: number;
  accessTokenSecret: string;
  authenticationService: AuthenticationService;
  refreshTokenExpiresInMs: number;
  strategyName: string;
  loggerService?: LoggerService;
  onSuccess?: (res: Response, credentials: AccessCredentials) => void;
}

export function googleController(params: GoogleControllerParams): RequestHandler {
  return async (req, res, next) => {
    return returnAccessTokenOAuth({
      accessTokenExpiresInMs: params.accessTokenExpiresInMs,
      accessTokenSecret: params.accessTokenSecret,
      authenticationService: params.authenticationService,
      refreshTokenExpiresInMs: params.refreshTokenExpiresInMs,
      strategyName: params.strategyName,
      loggerService: params.loggerService,
      onSuccess: params.onSuccess,
    })(req, res, next);
  };
}
