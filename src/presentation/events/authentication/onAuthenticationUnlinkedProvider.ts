import {AuthenticationUnlinkedProviderEventPayload} from '../../../domain/authentication/authentication.events.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';
import { SocketRooms, roomFormatter } from '../../../infrastructure/sockets/rooms.js';
import { socketSelector } from '../../services/getSocketService.js';
import { AuthenticationSocketEvents } from './socket.events.js';

interface Params {
  loggerService: LoggerService;
}

export function onAuthenticationUnlinkedProvider(params: Params) {
  return async (payload: AuthenticationUnlinkedProviderEventPayload) => {
    params.loggerService.info(`[EVENT ${onAuthenticationUnlinkedProvider.name}]: ${payload.providerId} -> ${payload.account.id}`);

    const socketsService = socketSelector().socket;

    socketsService.server.to(roomFormatter(SocketRooms.ACCOUNT, payload.account.id)).emit(AuthenticationSocketEvents.AUTHENTICATION_ACCOUNT_UNLINKED_PROVIDER, payload.account);

    socketsService.server.to(roomFormatter(SocketRooms.PROVIDER, payload.providerId)).emit(AuthenticationSocketEvents.AUTHENTICATION_AUTH_PROVIDER_UNLINKED_FROM_ACCOUNT, payload.providerId);
  };
}
