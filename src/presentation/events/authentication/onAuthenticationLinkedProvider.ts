import {AuthenticationLinkedProviderEventPayload} from '../../../domain/authentication/authentication.events.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';
import { SocketRooms, roomFormatter } from '../../../infrastructure/sockets/rooms.js';
import { socketSelector } from '../../services/getSocketService.js';
import { AuthenticationSocketEvents } from './socket.events.js';

interface Params {
  loggerService: LoggerService;
}

export function onAuthenticationLinkedProvider(params: Params) {
  return async (payload: AuthenticationLinkedProviderEventPayload) => {
    params.loggerService.info(`[EVENT ${onAuthenticationLinkedProvider.name}]: ${payload.provider.id} -> ${payload.account.id}`);

    const socketsService = socketSelector().socket;

    socketsService.server.to(roomFormatter(SocketRooms.ACCOUNT, payload.account.id)).emit(AuthenticationSocketEvents.AUTHENTICATION_ACCOUNT_LINKED_PROVIDER, payload.account);

    socketsService.server.to(roomFormatter(SocketRooms.PROVIDER, payload.provider.id)).emit(AuthenticationSocketEvents.AUTHENTICATION_AUTH_PROVIDER_LINKED_TO_ACCOUNT, payload.provider);
  };
}
