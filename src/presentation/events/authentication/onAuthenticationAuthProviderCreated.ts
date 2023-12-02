import {AuthenticationAuthProviderCreatedEventPayload} from '../../../domain/authentication/authentication.events.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';

interface Params {
  loggerService: LoggerService;
}

export function onAuthenticationAuthProviderCreated(params: Params) {
  return async (payload: AuthenticationAuthProviderCreatedEventPayload) => {
    params.loggerService.info(`[EVENT ${onAuthenticationAuthProviderCreated.name}]: ${payload.id}`);
  };
}
