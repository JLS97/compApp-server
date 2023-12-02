import {AuthenticationAccountRemovedEventPayload} from '../../../domain/authentication/authentication.events.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';

interface Params {
  loggerService: LoggerService;
}

export function onAuthenticationAccountRemoved(params: Params) {
  return async (payload: AuthenticationAccountRemovedEventPayload) => {
    params.loggerService.info(`[EVENT ${onAuthenticationAccountRemoved.name}]: ${payload.id}`);
  };
}
