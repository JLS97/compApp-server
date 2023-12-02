import {LoggerService} from '../../../domain/logger/LoggerService.js';
import { PushNotificationDevicesDeviceTokenRemovedEventPayload } from '../../../domain/pushNotificationDevices/pushNotificationDevices.events.js';

interface Params {
  loggerService: LoggerService;
}

export function onPushNotificationDevicesDeviceTokenRemoved(params: Params) {
  return async (payload: PushNotificationDevicesDeviceTokenRemovedEventPayload) => {
    params.loggerService.info(`[EVENT ${onPushNotificationDevicesDeviceTokenRemoved.name}]: ${payload.id}`);
  };
}
