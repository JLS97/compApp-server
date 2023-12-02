import {Server} from 'http';
import {Namespace, Socket, Server as SocketServer} from 'socket.io';
import {LoggerService} from '../../domain/logger/LoggerService.js';
import {AuthenticationService} from '../../application/authentication/authentication.service.js';
import {ExtendedSocket} from './types.js';
import {useSocketAuthentication} from './useSocketAuthentication.js';
import {DefaultEventsMap} from '@socket.io/component-emitter';
import {RunMonitorizationParams, runMonitorization} from './services/runMonitorization.js';

export interface SocketIOServiceParams {
  httpServer?: Server;
  namespace?: string;
  monitorizationNamespace?: string;
  accessTokenSecret: string;
  authenticationService: AuthenticationService;
  onConnectSuccess?: (socket: ExtendedSocket) => void;
  loggerService?: LoggerService;
  corsOrigins?: string[] | string
}

export class SocketIOService {
  private _io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  _socketServer: SocketServer;
  socket: ExtendedSocket;
  private _monitorizationNamespace: string;

  constructor(params: SocketIOServiceParams) {
    this._socketServer = new SocketServer(params?.httpServer, {
      cors: params.corsOrigins ? {
        origin: params.corsOrigins
      } : undefined
    });
    const namespace = params.namespace ?? 'client';
    this._monitorizationNamespace = params.monitorizationNamespace ?? 'monitorization';

    this._io = this._socketServer
      .of(`/${namespace}`)
      .use(
        useSocketAuthentication({
          accessTokenSecret: params.accessTokenSecret,
          authenticationService: params.authenticationService,
          onSocketReady: (socket: ExtendedSocket) => (this.socket = socket),
          loggerService: params.loggerService,
        })
      )
      .on('connection', () => {
        params.onConnectSuccess?.(this.socket);
      });
  }

  start(cb: (socket: Socket) => void) {
    this._io.on('connection', cb);
  }

  /**
   * Para que los eventos lleguen a cualquier usuario que se elija, hay que utilizar esto. Si se utiliza this.socket el evento no llegará al propio usuario del socket, pero ese caso lo manejamos nosotros mismos explicitando a qué usuarios les tienen que llegar los eventos
   */
  get server() {
    return this._io;
  }

  runMonitorization(
    mode: RunMonitorizationParams['mode'],
    username: RunMonitorizationParams['authUsername'],
    password: RunMonitorizationParams['authPassword']
  ) {
    runMonitorization({
      socketServer: this._socketServer,
      authUsername: username,
      authPassword: password,
      mode,
      namespace: this._monitorizationNamespace,
    });
  }
}
