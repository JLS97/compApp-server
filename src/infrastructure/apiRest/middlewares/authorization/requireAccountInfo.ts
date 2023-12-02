import {Request, Response} from 'express';
import {AuthenticatedUser} from '../../../../domain/authentication/types.js';
import {combineMiddlewares} from '../combineMiddlewares.js';
import {requireAccessToAccount} from './requireAccessToAccount.js';
import {BaseAccountInstance} from '../../../../domain/authentication/entities/Account/BaseAccount.model.js';
import {sendResponse} from '../../sendResponse.js';
import {ServerResponseCode, ServerResponseStatus} from '../../types.js';
import { LoggerService } from '../../../../domain/logger/LoggerService.js';

export interface RequireAccountInfoOptions {
  loggerService?: LoggerService
}

export const requireAccountInfo = (accountIdBodyKey: string, fromParams?: boolean, options?: RequireAccountInfoOptions) =>
  combineMiddlewares(
    requireAccessToAccount(accountIdBodyKey, fromParams, {
      loggerService: options?.loggerService,
    }),
    (
      req: Request<any, any, any, any, Record<string, any>>,
      res: Response<any, Record<string, any>>,
      next: any
    ): asserts req is Request & {user: AuthenticatedUser} & {selectedAccount: BaseAccountInstance} => {
      const accountId = fromParams ? req.params[accountIdBodyKey] : req.body[accountIdBodyKey];

      const selectedAccount = req.user.accounts.find((item) => item.id === accountId);

      if (!selectedAccount) {
        sendResponse(res, ServerResponseStatus.FORBIDDEN, ServerResponseCode.FORBIDDEN);
        return;
      }

      req.selectedAccount = selectedAccount;

      next();
    }
  );
