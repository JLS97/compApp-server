import {LoggerService} from '../../../domain/logger/LoggerService.js';
import { PushNotificationDevicesDeviceTokenAddedEventPayload } from '../../../domain/pushNotificationDevices/pushNotificationDevices.events.js';

interface Params {
  loggerService: LoggerService;
}

export function onPushNotificationDevicesDeviceTokenAdded(params: Params) {
  return async (payload: PushNotificationDevicesDeviceTokenAddedEventPayload) => {
    params.loggerService.info(`[EVENT ${onPushNotificationDevicesDeviceTokenAdded.name}]: ${payload.id}`);
  };
}
