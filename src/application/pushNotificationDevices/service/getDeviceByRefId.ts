import { Result } from "../../../domain/core/types/Result.js";
import { CoreResponses } from "../../../domain/core/core.responses.js";
import { prepareQueryOperation } from "../../../domain/operations/prepareQueryOperation.js";
import { PushNotificationDevicesDeviceInstance } from "../../../domain/pushNotificationDevices/entities/Device/Device.model.js";
import { PushNotificationDevicesDeviceSchemas } from "../../../domain/pushNotificationDevices/entities/Device/Device.schemas.js";
import { PushNotificationDevicesDatabase } from "../../../domain/pushNotificationDevices/pushNotificationDevices.database.js";
import { PushNotificationDevicesResponses } from "../pushNotificationDevices.responses.js";

export const GetDeviceByRefIdError = {
  ...CoreResponses.InvalidRequest,
  ...PushNotificationDevicesResponses.NotFound,
} as const;
export type GetDeviceByRefIdError = typeof GetDeviceByRefIdError[keyof typeof GetDeviceByRefIdError];

export async function getDeviceByRefId(db: PushNotificationDevicesDatabase, refId: string): Promise<Result<PushNotificationDevicesDeviceInstance, GetDeviceByRefIdError>> {
  if(!PushNotificationDevicesDeviceSchemas.refId.required().isValidSync(refId)){
    return Result.fail(GetDeviceByRefIdError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<PushNotificationDevicesDeviceInstance>({refId: refId});

  const deviceResult = await db.findDevice(searchQuery);

  if(deviceResult.isFailure){
    return Result.fail(GetDeviceByRefIdError.PUSH_NOTIFICATION_DEVICES_DEVICE_NOT_FOUND)
  }

  return Result.ok(deviceResult.success);
}