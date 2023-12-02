import {LoggerService} from '../../../domain/logger/LoggerService.js';
import { PushNotificationDevicesDeviceUnregisteredEventPayload } from '../../../domain/pushNotificationDevices/pushNotificationDevices.events.js';

interface Params {
  loggerService: LoggerService;
}

export function onPushNotificationDevicesDeviceUnregistered(params: Params) {
  return async (payload: PushNotificationDevicesDeviceUnregisteredEventPayload) => {
    params.loggerService.info(`[EVENT ${onPushNotificationDevicesDeviceUnregistered.name}]: ${payload.id}`);
  };
}
