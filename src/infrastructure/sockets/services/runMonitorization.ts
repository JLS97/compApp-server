import {Server as SocketServer} from 'socket.io';
import {instrument} from '@socket.io/admin-ui';
import bcrypt from 'bcryptjs';

export interface RunMonitorizationParams {
  socketServer: SocketServer;
  authUsername?: string;
  authPassword?: string;
  namespace: string;
  mode: 'development' | 'production';
}

export function runMonitorization(params: RunMonitorizationParams) {
  instrument(params.socketServer, {
    auth:
      params.authUsername && params.authPassword
        ? {
            type: 'basic',
            username: params.authUsername,
            password: bcrypt.hashSync(params.authPassword, 14),
          }
        : false,
    namespaceName: params.namespace,
    mode: params.mode,
  });
}
