import {AuthenticationAuthProviderChangedPasswordByCodeEventPayload} from '../../../domain/authentication/authentication.events.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';

interface Params {
  loggerService: LoggerService;
}

export function onAuthenticationAuthProviderChangedPasswordByCode(params: Params) {
  return async (payload: AuthenticationAuthProviderChangedPasswordByCodeEventPayload) => {
    params.loggerService.info(`[EVENT ${onAuthenticationAuthProviderChangedPasswordByCode.name}]: ${payload.id}`);
  };
}
