import {AuthenticationEvents} from '../../../domain/authentication/authentication.events.js';
import {getEventService} from '../../services/getEventService.js';
import {getLogger} from '../../services/getLogger.js';
import {onAuthenticationAccountCreated} from './onAuthenticationAccountCreated.js';
import {onAuthenticationAccountRemoved} from './onAuthenticationAccountRemoved.js';
import {onAuthenticationAccountUpdated} from './onAuthenticationAccountUpdated.js';
import {onAuthenticationAuthProviderChangedEmail} from './onAuthenticationAuthProviderChangedEmail.js';
import {onAuthenticationAuthProviderChangedPassword} from './onAuthenticationAuthProviderChangedPassword.js';
import {onAuthenticationAuthProviderChangedPasswordByCode} from './onAuthenticationAuthProviderChangedPasswordByCode.js';
import {onAuthenticationAuthProviderCreated} from './onAuthenticationAuthProviderCreated.js';
import {onAuthenticationEmailPasswordResetRequested} from './onAuthenticationEmailPasswordResetRequested.js';
import {onAuthenticationLinkedProvider} from './onAuthenticationLinkedProvider.js';
import {onAuthenticationUnlinkedProvider} from './onAuthenticationUnlinkedProvider.js';

const eventsService = getEventService();
const loggerService = getLogger();

export function registerAuthenticationEvents() {
  eventsService.on(
    AuthenticationEvents.AUTHENTICATION_ACCOUNT_CREATED,
    onAuthenticationAccountCreated({
      loggerService,
    })
  );

  eventsService.on(
    AuthenticationEvents.AUTHENTICATION_ACCOUNT_REMOVED,
    onAuthenticationAccountRemoved({
      loggerService,
    })
  );

  eventsService.on(
    AuthenticationEvents.AUTHENTICATION_ACCOUNT_UPDATED,
    onAuthenticationAccountUpdated({
      loggerService,
    })
  );

  eventsService.on(
    AuthenticationEvents.AUTHENTICATION_LINKED_PROVIDER,
    onAuthenticationLinkedProvider({
      loggerService,
    })
  );

  eventsService.on(
    AuthenticationEvents.AUTHENTICATION_UNLINKED_PROVIDER,
    onAuthenticationUnlinkedProvider({
      loggerService,
    })
  );

  eventsService.on(
    AuthenticationEvents.AUTHENTICATION_EMAIL_PASSWORD_RESET_REQUESTED,
    onAuthenticationEmailPasswordResetRequested({
      loggerService,
    })
  );

  eventsService.on(
    AuthenticationEvents.AUTHENTICATION_AUTH_PROVIDER_CREATED,
    onAuthenticationAuthProviderCreated({
      loggerService,
    })
  );

  eventsService.on(
    AuthenticationEvents.AUTHENTICATION_AUTH_PROVIDER_CHANGED_PASSWORD,
    onAuthenticationAuthProviderChangedPassword({
      loggerService,
    })
  );

  eventsService.on(
    AuthenticationEvents.AUTHENTICATION_AUTH_PROVIDER_CHANGED_PASSWORD_BY_CODE,
    onAuthenticationAuthProviderChangedPasswordByCode({
      loggerService,
    })
  );

  eventsService.on(
    AuthenticationEvents.AUTHENTICATION_AUTH_PROVIDER_CHANGED_EMAIL,
    onAuthenticationAuthProviderChangedEmail({
      loggerService,
    })
  );
}
