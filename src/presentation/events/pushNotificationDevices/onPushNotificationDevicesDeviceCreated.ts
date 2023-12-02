import {LoggerService} from '../../../domain/logger/LoggerService.js';
import { PushNotificationDevicesDeviceCreatedEventPayload } from '../../../domain/pushNotificationDevices/pushNotificationDevices.events.js';

interface Params {
  loggerService: LoggerService;
}

export function onPushNotificationDevicesDeviceCreated(params: Params) {
  return async (payload: PushNotificationDevicesDeviceCreatedEventPayload) => {
    params.loggerService.info(`[EVENT ${onPushNotificationDevicesDeviceCreated.name}]: ${payload.id}`);
  };
}
