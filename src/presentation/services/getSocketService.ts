import {Server} from 'http';
import {AuthenticationService} from '../../application/authentication/authentication.service.js';
import {SocketIOService} from '../../infrastructure/sockets/SocketIOService.js';
import {ENV} from '../../env.js';
import {LoggerService} from '../../domain/logger/LoggerService.js';
import {SocketRooms, roomFormatter} from '../../infrastructure/sockets/rooms.js';
import { getLogger } from './getLogger.js';

let socket: SocketIOService;

interface CreateSocketServiceParams {
  httpServer: Server;
  authenticationService: AuthenticationService;
  loggerService?: LoggerService;
}

export function createSocketService(params: CreateSocketServiceParams) {
  socket = new SocketIOService({
    httpServer: params.httpServer,
    corsOrigins: ENV.SOCKET_CORS_ORIGINS,
    loggerService: getLogger(),
    accessTokenSecret: ENV.JWT_SECRET,
    authenticationService: params.authenticationService,
    namespace: ENV.SOCKET_NAMESPACE,
    monitorizationNamespace: ENV.SOCKET_MONITORIZATION_NAMESPACE,
    onConnectSuccess: (socket) => {
      if (!socket.accounts) {
        params.loggerService?.error('[SOCKET] Accounts not found');
        return;
      }

      socket.join(roomFormatter(SocketRooms.PROVIDER, socket.authProviderId));

      socket.accounts.forEach((account) => {
        socket.join(roomFormatter(SocketRooms.ACCOUNT, account.id));

        account.providersId.filter(id => id === socket.authProviderId).forEach((id) => {
          socket.join(roomFormatter(SocketRooms.PROVIDER, id));
        });
      });
    },
  });
}

export function socketSelector() {
  if (!socket) {
    throw new Error('You must run the createSocketService function before getting a socket');
  }

  return {
    socket: socket,
  };
}
