import { Result } from "../../../domain/core/types/Result.js";
import { CoreResponses } from "../../../domain/core/core.responses.js";
import { EventsService } from "../../../domain/events/EventsService.js";
import { PushNotificationDevicesDevice, PushNotificationDevicesDeviceInstance, PushNotificationDevicesDeviceValues } from "../../../domain/pushNotificationDevices/entities/Device/Device.model.js";
import { PushNotificationDevicesDatabase } from "../../../domain/pushNotificationDevices/pushNotificationDevices.database.js";
import { PushNotificationDevicesDeviceCreatedEventPayload, PushNotificationDevicesEvents } from "../../../domain/pushNotificationDevices/pushNotificationDevices.events.js";

export const CreateDeviceError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type CreateDeviceError = typeof CreateDeviceError[keyof typeof CreateDeviceError];

export async function createDevice(db: PushNotificationDevicesDatabase, events: EventsService, fields: Partial<PushNotificationDevicesDeviceInstance> & PushNotificationDevicesDeviceValues): Promise<Result<PushNotificationDevicesDeviceInstance, CreateDeviceError>> {
  const deviceCandidate = new PushNotificationDevicesDevice(fields);

  if(!deviceCandidate.isValidCreateValue()){
    return Result.fail(CreateDeviceError.INVALID_REQUEST);
  }

  const result = await db.addDevice(deviceCandidate.values());

  if(result.isFailure){
    return Result.fail(CreateDeviceError.UNKNOWN)
  }

  events.emit<PushNotificationDevicesDeviceCreatedEventPayload>(PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_CREATED, result.success);

  return Result.ok(result.success);
}