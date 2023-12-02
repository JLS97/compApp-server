import {LoggerService} from '../../../domain/logger/LoggerService.js';
import { PushNotificationDevicesDeviceRemovedEventPayload } from '../../../domain/pushNotificationDevices/pushNotificationDevices.events.js';

interface Params {
  loggerService: LoggerService;
}

export function onPushNotificationDevicesDeviceRemoved(params: Params) {
  return async (payload: PushNotificationDevicesDeviceRemovedEventPayload) => {
    params.loggerService.info(`[EVENT ${onPushNotificationDevicesDeviceRemoved.name}]: ${payload.id}`);
  };
}
