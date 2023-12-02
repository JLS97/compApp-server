import * as yup from 'yup';
import { Result } from "../../../domain/core/types/Result.js";
import { CoreResponses } from "../../../domain/core/core.responses.js";
import { EventsService } from "../../../domain/events/EventsService.js";
import { PushNotificationDevicesDeviceInstance } from "../../../domain/pushNotificationDevices/entities/Device/Device.model.js";
import { PushNotificationDevicesService } from "../pushNotificationDevices.service.js";
import { PushNotificationDevicesDeviceSchemas } from '../../../domain/pushNotificationDevices/entities/Device/Device.schemas.js';
import { PushNotificationDevicesResponses } from '../pushNotificationDevices.responses.js';
import { PushNotificationDevicesDeviceUnregisteredEventPayload, PushNotificationDevicesEvents } from '../../../domain/pushNotificationDevices/pushNotificationDevices.events.js';

export const UnregisterDeviceError = {
  ...CoreResponses.InvalidRequest,
  ...PushNotificationDevicesResponses.NotFound,
} as const;
export type UnregisterDeviceError = typeof UnregisterDeviceError[keyof typeof UnregisterDeviceError];

export async function unregisterDevice(pushNotificationDevicesService: PushNotificationDevicesService, eventsService: EventsService, refId: string, token: string): Promise<Result<PushNotificationDevicesDeviceInstance, UnregisterDeviceError>>{
  const schema = yup.object().shape({
    refId: PushNotificationDevicesDeviceSchemas.refId.required(),
    token: PushNotificationDevicesDeviceSchemas.token.required(),
  });

  if (!schema.isValidSync({refId, token})) {
    return Result.fail(UnregisterDeviceError.INVALID_REQUEST);
  }

  const updateDeviceResult = await pushNotificationDevicesService.removeTokenFromDevice(refId, token);

  if (updateDeviceResult.isFailure) {
    return Result.fail(updateDeviceResult.failure);
  }

  if (updateDeviceResult.success.tokens.length <= 0) {
    const deleteDeviceResult = await pushNotificationDevicesService.deleteDeviceByRefId(refId);

    if (deleteDeviceResult.isFailure) {
      return Result.fail(deleteDeviceResult.failure);
    }

    eventsService.emit<PushNotificationDevicesDeviceUnregisteredEventPayload>(PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_UNREGISTERED, deleteDeviceResult.success);

    return Result.ok();
  }

  eventsService.emit<PushNotificationDevicesDeviceUnregisteredEventPayload>(PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_UNREGISTERED, updateDeviceResult.success);

  return Result.ok(updateDeviceResult.success);
}