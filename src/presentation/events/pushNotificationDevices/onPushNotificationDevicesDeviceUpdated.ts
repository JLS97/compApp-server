import {LoggerService} from '../../../domain/logger/LoggerService.js';
import { PushNotificationDevicesDeviceUpdatedEventPayload } from '../../../domain/pushNotificationDevices/pushNotificationDevices.events.js';

interface Params {
  loggerService: LoggerService;
}

export function onPushNotificationDevicesDeviceUpdated(params: Params) {
  return async (payload: PushNotificationDevicesDeviceUpdatedEventPayload) => {
    params.loggerService.info(`[EVENT ${onPushNotificationDevicesDeviceUpdated.name}]: ${payload.id}`);
  };
}
