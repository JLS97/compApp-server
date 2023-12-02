import {AuthenticationAuthProviderChangedEmailEventPayload} from '../../../domain/authentication/authentication.events.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';
import { SocketRooms, roomFormatter } from '../../../infrastructure/sockets/rooms.js';
import { socketSelector } from '../../services/getSocketService.js';
import { AuthenticationSocketEvents } from './socket.events.js';

interface Params {
  loggerService: LoggerService;
}

export function onAuthenticationAuthProviderChangedEmail(params: Params) {
  return async (payload: AuthenticationAuthProviderChangedEmailEventPayload) => {
    params.loggerService.info(`[EVENT ${onAuthenticationAuthProviderChangedEmail.name}]: ${payload.id}`);

    const socketsService = socketSelector().socket;

    socketsService.server.to(roomFormatter(SocketRooms.PROVIDER, payload.id)).emit(AuthenticationSocketEvents.AUTHENTICATION_AUTH_PROVIDER_CHANGED_EMAIL, payload);
  };
}
