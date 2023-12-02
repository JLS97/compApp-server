import * as yup from 'yup';
import { Result } from "../../../domain/core/types/Result.js";
import { CoreResponses } from "../../../domain/core/core.responses.js";
import { EventsService } from "../../../domain/events/EventsService.js";
import { PushNotificationDevicesDevice, PushNotificationDevicesDeviceInstance } from "../../../domain/pushNotificationDevices/entities/Device/Device.model.js";
import { PushNotificationDevicesService } from "../pushNotificationDevices.service.js";
import { PushNotificationDevicesDeviceSchemas } from '../../../domain/pushNotificationDevices/entities/Device/Device.schemas.js';
import { AddTokenToDeviceError } from './addTokenToDevice.js';
import { PushNotificationDevicesDeviceRegisteredEventPayload, PushNotificationDevicesEvents } from '../../../domain/pushNotificationDevices/pushNotificationDevices.events.js';
import { PushNotificationDevicesResponses } from '../pushNotificationDevices.responses.js';

export const RegisterDeviceError = {
  ...CoreResponses.InvalidRequest,
  ...PushNotificationDevicesResponses.NotFound,
} as const;
export type RegisterDeviceError = typeof RegisterDeviceError[keyof typeof RegisterDeviceError];

export async function registerDevice(pushNotificationDevicesService: PushNotificationDevicesService, eventsService: EventsService, refId: string, token: string): Promise<Result<PushNotificationDevicesDeviceInstance, RegisterDeviceError>>{
  const schema = yup.object().shape({
    refId: PushNotificationDevicesDeviceSchemas.refId.required(),
    token: PushNotificationDevicesDeviceSchemas.token.required(),
  });

  if (!schema.isValidSync({refId, token})) {
    return Result.fail(RegisterDeviceError.INVALID_REQUEST);
  }

  const updateDeviceResult = await pushNotificationDevicesService.addTokenToDevice(refId, token);

  if (updateDeviceResult.isFailure && updateDeviceResult.failure !== AddTokenToDeviceError.PUSH_NOTIFICATION_DEVICES_DEVICE_NOT_FOUND) {
    return Result.fail(updateDeviceResult.failure);
  }

  if (updateDeviceResult.isFailure) {
    const newDevice = new PushNotificationDevicesDevice({
      refId,
      tokens: [token],
    });

    const creationResult = await pushNotificationDevicesService.createDevice(newDevice);

    if (creationResult.isFailure) {
      return Result.fail(creationResult.failure);
    }

    eventsService.emit<PushNotificationDevicesDeviceRegisteredEventPayload>(PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_REGISTERED, creationResult.success);

    return Result.ok(creationResult.success);
  }

  eventsService.emit<PushNotificationDevicesDeviceRegisteredEventPayload>(PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_REGISTERED, updateDeviceResult.success);

  return Result.ok(updateDeviceResult.success);
}