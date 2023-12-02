import {AuthenticationEmailPasswordResetRequestedEventPayload} from '../../../domain/authentication/authentication.events.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';

interface Params {
  loggerService: LoggerService;
}

export function onAuthenticationEmailPasswordResetRequested(params: Params) {
  return async (payload: AuthenticationEmailPasswordResetRequestedEventPayload) => {
    params.loggerService.info(`[EVENT ${onAuthenticationEmailPasswordResetRequested.name}]: ${payload.id}`);
  };
}
