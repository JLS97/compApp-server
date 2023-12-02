import jwt from 'jsonwebtoken';
import {ExtendedSocket} from './types.js';
import {AuthenticationService} from '../../application/authentication/authentication.service.js';
import {LoggerService} from '../../domain/logger/LoggerService.js';
import {AccessTokenPayload} from '../../domain/authentication/types.js';

export interface UseSocketAuthenticationParams {
  authenticationService: AuthenticationService;
  accessTokenSecret: string;
  onSocketReady: (socket: ExtendedSocket) => void;
  loggerService?: LoggerService;
}

export function useSocketAuthentication(params: UseSocketAuthenticationParams) {
  return async (socket: ExtendedSocket, next: (err?: any) => void): Promise<void> => {
    const accessToken = socket.handshake.auth.accessToken;

    try {
      const decodedToken = jwt.verify(accessToken, params.accessTokenSecret) as AccessTokenPayload;

      const accountsResult = await params.authenticationService.getAccountsById(decodedToken.accountIds);

      if (accountsResult.isFailure) {
        params.loggerService?.error(`[SOCKET] Could not get accounts from the authentication service. Error: ${accountsResult.failure}`);
        return next(new Error('SOCKET UNAUTHORIZED'));
      }

      socket.accountsId = decodedToken.accountIds;
      socket.accounts = accountsResult.success;
      socket.authProviderId = decodedToken.authProviderId;

      params.onSocketReady(socket);

      next();
    } catch (_error) {
      params.loggerService?.error(`[SOCKET] CLIENT_SOCKET_UNAUTHORIZED: ${accessToken}`);
      return next(new Error('SOCKET UNAUTHORIZED'));
    }
  };
}
