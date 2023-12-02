import {RequestHandler} from 'express';
import {sendResponse} from '../../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';
import {AuthenticationService} from '../../../../application/authentication/authentication.service.js';
import {returnAccessToken} from '../../middlewares/authentication/returnAccessToken.js';
import {LoggerService} from '../../../../domain/logger/LoggerService.js';

interface SignupControllerParams {
  authenticationService: AuthenticationService;
  accessTokenExpiresInMs: number;
  refreshTokenExpiresInMs: number;
  accessTokenSecret: string;
  loggerService?: LoggerService;
}

export function signupController(params: SignupControllerParams): RequestHandler {
  return async (req, res, next) => {
    const result = await params.authenticationService.signupWithEmailAndPassword(req.body.email, req.body.password);

    if (result.isFailure) {
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    return returnAccessToken({
      authenticationService: params.authenticationService,
      accessTokenExpiresInMs: params.accessTokenExpiresInMs,
      accessTokenSecret: params.accessTokenSecret,
      refreshTokenExpiresInMs: params.refreshTokenExpiresInMs,
      loggerService: params.loggerService,
    })(req, res, next);
  };
}
