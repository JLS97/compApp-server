import express from 'express';
import {Controllers, Middlewares} from '../../infrastructure/apiRest/index.js';
import {ENV} from '../../env.js';
import {getLogger} from '../services/getLogger.js';
import {getEventService} from '../services/getEventService.js';
import { PushNotificationDevicesService } from '../../application/pushNotificationDevices/pushNotificationDevices.service.js';
import { getPushNotificationDevicesDatabase } from '../services/getPushNotificationDevicesDatabase.js';

const apiRestPushNotificationDevices = express.Router();

const loggerService = getLogger();
const eventsService = getEventService();

const pushNotificationDevicesDatabase = getPushNotificationDevicesDatabase();

const pushNotificationDevicesService = new PushNotificationDevicesService({
  pushNotificationDevicesDatabase,
  eventsService: eventsService,
});

/**
 * Registra un dispositivo para el envío de notificaciones push
 */
apiRestPushNotificationDevices.post(
  '/register',
  Middlewares.isFeaturedEnabled(ENV.PUSH_NOTIFICATION_DEVICES_ENABLED),
  Middlewares.authorization.requireAccountInfo("accountId", undefined, {loggerService}),
  Middlewares.errorHandler(
    Controllers.pushNotificationDevices.registerController({
      pushNotificationDevicesService
    }),
    loggerService
  )
);

/**
 * Elimina un dispositivo para el envío de notificaciones push
 */
apiRestPushNotificationDevices.post(
  '/unregister',
  Middlewares.isFeaturedEnabled(ENV.PUSH_NOTIFICATION_DEVICES_ENABLED),
  Middlewares.authorization.requireAccountInfo("accountId", undefined, {loggerService}),
  Middlewares.errorHandler(
    Controllers.pushNotificationDevices.unregisterController({
      pushNotificationDevicesService
    }),
    loggerService
  )
);

export {apiRestPushNotificationDevices};
