import {LoggerService} from '../../../domain/logger/LoggerService.js';
import { PushNotificationDevicesDeviceRegisteredEventPayload } from '../../../domain/pushNotificationDevices/pushNotificationDevices.events.js';

interface Params {
  loggerService: LoggerService;
}

export function onPushNotificationDevicesDeviceRegistered(params: Params) {
  return async (payload: PushNotificationDevicesDeviceRegisteredEventPayload) => {
    params.loggerService.info(`[EVENT ${onPushNotificationDevicesDeviceRegistered.name}]: ${payload.id}`);
  };
}
