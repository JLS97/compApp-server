import {Server as SocketServer} from 'socket.io';
import {instrument} from '@socket.io/admin-ui';
import bcrypt from 'bcryptjs';

export interface RunMonitorizationParams {
  socketServer: SocketServer;
  authUsername: string;
  authPassword: string;
  namespace: string;
  mode: 'development' | 'production';
}

/**
 * Expone el panel de administración de Socket.IO. Siempre exige autenticación: sin ella, cualquiera podría ver, desconectar o mover de sala los sockets
 */
export function runMonitorization(params: RunMonitorizationParams) {
  if (!params.authUsername || !params.authPassword) {
    throw new Error('Socket monitorization requires a username and a password');
  }

  instrument(params.socketServer, {
    auth: {
      type: 'basic',
      username: params.authUsername,
      password: bcrypt.hashSync(params.authPassword, 14),
    },
    namespaceName: params.namespace,
    mode: params.mode,
  });
}
