import {Request, Response} from 'express';
import {requireAccessToken} from './requireAccessToken.js';
import {combineMiddlewares} from '../combineMiddlewares.js';
import {AuthenticatedUser} from '../../../../domain/authentication/types.js';
import {hasAccessToAccount} from '../../../../application/authentication/utils/hasAccessToAccount.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';
import {sendResponse} from '../../sendResponse.js';
import { LoggerService } from '../../../../domain/logger/LoggerService.js';

export interface RequireAccessToAccountOptions {
  loggerService?: LoggerService
}

export const requireAccessToAccount = (accountIdBodyKey: string, fromParams?: boolean, options?: RequireAccessToAccountOptions) =>
  combineMiddlewares(
    requireAccessToken({
      loggerService: options?.loggerService
    }),
    (
      req: Request<any, any, any, any, Record<string, any>>,
      res: Response<any, Record<string, any>>,
      next: any
    ): asserts req is Request & {user: AuthenticatedUser} => {
      const accountId = fromParams ? req.params[accountIdBodyKey] : req.body[accountIdBodyKey];

      const hasAccess = hasAccessToAccount(accountId, req.user);

      if (!hasAccess) {
        sendResponse(res, ServerResponseStatus.FORBIDDEN, ServerResponseCode.FORBIDDEN);
        return;
      }

      next();
    }
  );
