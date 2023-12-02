import { Result } from "../../../domain/core/types/Result.js";
import { CoreResponses } from "../../../domain/core/core.responses.js";
import { EventsService } from "../../../domain/events/EventsService.js";
import { prepareQueryOperation } from "../../../domain/operations/prepareQueryOperation.js";
import { prepareUpdateOperation } from "../../../domain/operations/prepareUpdateOperation.js";
import { PushNotificationDevicesDevice, PushNotificationDevicesDeviceInstance, PushNotificationDevicesDeviceValues } from "../../../domain/pushNotificationDevices/entities/Device/Device.model.js";
import { PushNotificationDevicesDeviceSchemas } from "../../../domain/pushNotificationDevices/entities/Device/Device.schemas.js";
import { PushNotificationDevicesDatabase } from "../../../domain/pushNotificationDevices/pushNotificationDevices.database.js";
import { PushNotificationDevicesDeviceUpdatedEventPayload, PushNotificationDevicesEvents } from "../../../domain/pushNotificationDevices/pushNotificationDevices.events.js";
import { PartialDeep } from "type-fest";

export const UpdateDeviceByRefIdError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type UpdateDeviceByRefIdError = typeof UpdateDeviceByRefIdError[keyof typeof UpdateDeviceByRefIdError];

export async function updateDeviceByRefId(db: PushNotificationDevicesDatabase, events: EventsService, refId: string, values: PartialDeep<PushNotificationDevicesDeviceValues>): Promise<Result<PushNotificationDevicesDeviceInstance, UpdateDeviceByRefIdError>> {
  const deviceCandidate = new PushNotificationDevicesDevice(values);

  if(!PushNotificationDevicesDeviceSchemas.refId.required().isValidSync(refId) || !deviceCandidate.isValidUpdateValue()){
    return Result.fail(UpdateDeviceByRefIdError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<PushNotificationDevicesDeviceInstance>({refId: refId});
  const updateQuery = prepareUpdateOperation<PushNotificationDevicesDeviceInstance>(values);

  const result = await db.editDevice(searchQuery, updateQuery);

  if(result.isFailure){
    return Result.fail(UpdateDeviceByRefIdError.UNKNOWN)
  }

  events.emit<PushNotificationDevicesDeviceUpdatedEventPayload>(PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_UPDATED, result.success);

  return Result.ok(result.success);
}