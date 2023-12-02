import {RequestHandler} from 'express';
import {AuthenticationService} from '../../../../application/authentication/authentication.service.js';
import {sendResponse} from '../../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';

interface RefreshTokenControllerParams {
  authenticationService: AuthenticationService;
  accessTokenSecret: string;
  accessTokenExpiresInMs: number;
}

export function refreshTokenController(params: RefreshTokenControllerParams): RequestHandler {
  return async (req, res) => {
    const {refreshToken} = req.body;

    const result = await params.authenticationService.createAccessTokenFromRefreshToken(refreshToken, {
      accessTokenSecret: params.accessTokenSecret,
      expiresInMs: params.accessTokenExpiresInMs,
    });

    if (result.isFailure) {
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success);
  };
}
