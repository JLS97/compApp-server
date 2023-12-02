import {Request, Response} from 'express';
import {AuthenticationService} from '../../../../application/authentication/authentication.service.js';
import {getPassport} from '../../../passport/passport.js';
import {AccessCredentials, AccessTokenPayload} from '../../../../domain/authentication/types.js';
import {Result} from '../../../../domain/core/types/Result.js';
import {ServerResponseCode} from '../../types.js';
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
      if (error) {
        params.loggerService?.error(error);
      }

      if (!user) {
        /**
         * Parece que en la primera llamada para recuperar el código (/apple) no hay cuenta y tiene que salirse del flujo
         * Si haces un redirect en este punto, falla la autenticación
         */
        return Result.fail(ServerResponseCode.BAD_REQUEST);
      }

      const result = await params.authenticationService.generateCredentials(user.authProviderId, {
        accessTokenExpiresInMs: params.accessTokenExpiresInMs,
        accessTokenSecret: params.accessTokenSecret,
        refreshTokenExpiresInMs: params.refreshTokenExpiresInMs,
      });

      if (result.isFailure) {
        return Result.fail(ServerResponseCode.UNAUTHORIZED);
      }

      params.onSuccess?.(res, result.success);
    })(req, res, next);
  };
}
