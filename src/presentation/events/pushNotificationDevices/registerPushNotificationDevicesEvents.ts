import { PushNotificationDevicesEvents } from '../../../domain/pushNotificationDevices/pushNotificationDevices.events.js';
import {getEventService} from '../../services/getEventService.js';
import {getLogger} from '../../services/getLogger.js';
import { onPushNotificationDevicesDeviceCreated } from './onPushNotificationDevicesDeviceCreated.js';
import { onPushNotificationDevicesDeviceRegistered } from './onPushNotificationDevicesDeviceRegistered.js';
import { onPushNotificationDevicesDeviceRemoved } from './onPushNotificationDevicesDeviceRemoved.js';
import { onPushNotificationDevicesDeviceTokenAdded } from './onPushNotificationDevicesDeviceTokenAdded.js';
import { onPushNotificationDevicesDeviceTokenRemoved } from './onPushNotificationDevicesDeviceTokenRemoved.js';
import { onPushNotificationDevicesDeviceUnregistered } from './onPushNotificationDevicesDeviceUnregistered.js';
import { onPushNotificationDevicesDeviceUpdated } from './onPushNotificationDevicesDeviceUpdated.js';

const eventsService = getEventService();
const loggerService = getLogger();

export function registerPushNotificationDevicesEvents() {
  eventsService.on(
    PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_CREATED,
    onPushNotificationDevicesDeviceCreated({
      loggerService,
    })
  );

  eventsService.on(
    PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_UPDATED,
    onPushNotificationDevicesDeviceUpdated({
      loggerService,
    })
  );

  eventsService.on(
    PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_REMOVED,
    onPushNotificationDevicesDeviceRemoved({
      loggerService,
    })
  );

  eventsService.on(
    PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_TOKEN_ADDED,
    onPushNotificationDevicesDeviceTokenAdded({
      loggerService,
    })
  );

  eventsService.on(
    PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_TOKEN_REMOVED,
    onPushNotificationDevicesDeviceTokenRemoved({
      loggerService,
    })
  );

  eventsService.on(
    PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_REGISTERED,
    onPushNotificationDevicesDeviceRegistered({
      loggerService,
    })
  );

  eventsService.on(
    PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_UNREGISTERED,
    onPushNotificationDevicesDeviceUnregistered({
      loggerService,
    })
  );
  
}
