import {createServer} from 'http';
import {ENV} from './env.js';
import {apiRest} from './presentation/api-rest/router.js';
import {registerApplicationCronjobs} from './presentation/cronjobs/registerApplicationCronjobs.js';
import {registerApplicationEvents} from './presentation/events/registerApplicationEvents.js';
import {createSocketService, socketSelector} from './presentation/services/getSocketService.js';
import {AuthenticationService} from './application/authentication/authentication.service.js';
import {getAuthenticationDatabase} from './presentation/services/getAuthenticationDatabase.js';
import {getEventService} from './presentation/services/getEventService.js';
import {getLogger} from './presentation/services/getLogger.js';
import { initializeFirebase } from './infrastructure/firebase/getFirebase.js';

const port = process.env.PORT ?? ENV.API_REST_PORT;

const server = createServer(apiRest);

const loggerService = getLogger();

if(ENV.FIREBASE_ENABLED){
  (async () => {
    await initializeFirebase({
      credentialFilename: ENV.FIREBASE_SERVICE_ACCOUNT_FILENAME,
    });
    loggerService.info(`[FIREBASE] Firebase initialized successfully`)
  })();
}

const authenticationDatabase = getAuthenticationDatabase();
const eventsService = getEventService();

const authenticationService = new AuthenticationService({
  authenticationDatabase: authenticationDatabase,
  events: eventsService,
});

registerApplicationEvents();
registerApplicationCronjobs();

server.listen(port, () => {
  loggerService.info(`[SERVER]: Server is running on port ${port}`);
});

if (ENV.SOCKET_ENABLED) {
  createSocketService({
    authenticationService,
    httpServer: server,
    loggerService,
  });

  const socketService = socketSelector().socket;

  socketService.runMonitorization(ENV.SOCKET_MONITORIZATION_MODE, ENV.SOCKET_MONITORIZATION_USERNAME, ENV.SOCKET_MONITORIZATION_PASSWORD);

  socketService.start((socket) => {
    loggerService.info(`[SOCKET]: Client connected ${socket.id}`);
  });
}
