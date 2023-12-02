import {AuthenticationAccountCreatedEventPayload} from '../../../domain/authentication/authentication.events.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';

interface Params {
  loggerService: LoggerService;
}

export function onAuthenticationAccountCreated(params: Params) {
  return async (payload: AuthenticationAccountCreatedEventPayload) => {
    params.loggerService.info(`[EVENT ${onAuthenticationAccountCreated.name}]: ${payload.id}`);
  };
}
