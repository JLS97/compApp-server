import {AuthenticationAuthProviderChangedPasswordEventPayload} from '../../../domain/authentication/authentication.events.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';

interface Params {
  loggerService: LoggerService;
}

export function onAuthenticationAuthProviderChangedPassword(params: Params) {
  return async (payload: AuthenticationAuthProviderChangedPasswordEventPayload) => {
    params.loggerService.info(`[EVENT ${onAuthenticationAuthProviderChangedPassword.name}]: ${payload.id}`);
  };
}
