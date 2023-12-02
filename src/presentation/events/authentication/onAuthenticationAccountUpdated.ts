import {AuthenticationAccountUpdatedEventPayload} from '../../../domain/authentication/authentication.events.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';
import { SocketRooms, roomFormatter } from '../../../infrastructure/sockets/rooms.js';
import { socketSelector } from '../../services/getSocketService.js';
import { AuthenticationSocketEvents } from './socket.events.js';

interface Params {
  loggerService: LoggerService;
}

export function onAuthenticationAccountUpdated(params: Params) {
  return async (payload: AuthenticationAccountUpdatedEventPayload) => {
    params.loggerService.info(`[EVENT ${onAuthenticationAccountUpdated.name}]: ${payload.id}`);

    const socketsService = socketSelector().socket;

    socketsService.server.to(roomFormatter(SocketRooms.ACCOUNT, payload.id)).emit(AuthenticationSocketEvents.AUTHENTICATION_ACCOUNT_UPDATED, payload);
  };
}
