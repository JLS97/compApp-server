import { Result } from "../../../domain/core/types/Result.js";
import { CoreResponses } from "../../../domain/core/core.responses.js";
import { EventsService } from "../../../domain/events/EventsService.js";
import { prepareQueryOperation } from "../../../domain/operations/prepareQueryOperation.js";
import { PushNotificationDevicesDeviceInstance } from "../../../domain/pushNotificationDevices/entities/Device/Device.model.js";
import { PushNotificationDevicesDeviceSchemas } from "../../../domain/pushNotificationDevices/entities/Device/Device.schemas.js";
import { PushNotificationDevicesDatabase } from "../../../domain/pushNotificationDevices/pushNotificationDevices.database.js";
import { PushNotificationDevicesDeviceRemovedEventPayload, PushNotificationDevicesEvents } from "../../../domain/pushNotificationDevices/pushNotificationDevices.events.js";
import { PushNotificationDevicesResponses } from "../pushNotificationDevices.responses.js";

export const DeleteDeviceByRefIdError = {
  ...CoreResponses.InvalidRequest,
  ...PushNotificationDevicesResponses.NotFound,
} as const;
export type DeleteDeviceByRefIdError = typeof DeleteDeviceByRefIdError[keyof typeof DeleteDeviceByRefIdError];

export async function deleteDeviceByRefId(db: PushNotificationDevicesDatabase, events: EventsService, refId: string): Promise<Result<PushNotificationDevicesDeviceInstance, DeleteDeviceByRefIdError>> {
  if(!PushNotificationDevicesDeviceSchemas.refId.required().isValidSync(refId)){
    return Result.fail(DeleteDeviceByRefIdError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<PushNotificationDevicesDeviceInstance>({refId: refId});

  const result = await db.removeDevice(searchQuery);

  if(result.isFailure){
    return Result.fail(DeleteDeviceByRefIdError.PUSH_NOTIFICATION_DEVICES_DEVICE_NOT_FOUND)
  }

  events.emit<PushNotificationDevicesDeviceRemovedEventPayload>(PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_REMOVED, result.success);

  return Result.ok(result.success);
}