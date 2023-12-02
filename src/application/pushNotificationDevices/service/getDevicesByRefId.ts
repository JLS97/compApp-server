import * as yup from 'yup'
import { Result } from "../../../domain/core/types/Result.js";
import { CoreResponses } from "../../../domain/core/core.responses.js";
import { prepareQueryOperation } from "../../../domain/operations/prepareQueryOperation.js";
import { PushNotificationDevicesDeviceInstance } from "../../../domain/pushNotificationDevices/entities/Device/Device.model.js";
import { PushNotificationDevicesDeviceSchemas } from "../../../domain/pushNotificationDevices/entities/Device/Device.schemas.js";
import { PushNotificationDevicesDatabase } from "../../../domain/pushNotificationDevices/pushNotificationDevices.database.js";

export const GetDevicesByRefIdError = {
  ...CoreResponses.InvalidRequest,
  ...CoreResponses.Unknown,
} as const;
export type GetDevicesByRefIdError = typeof GetDevicesByRefIdError[keyof typeof GetDevicesByRefIdError];

export async function getDevicesByRefId(db: PushNotificationDevicesDatabase, refIds: string[]): Promise<Result<PushNotificationDevicesDeviceInstance[], GetDevicesByRefIdError>> {
  if(!yup.array().of(PushNotificationDevicesDeviceSchemas.refId.required()).isValidSync(refIds)){
    return Result.fail(GetDevicesByRefIdError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<Omit<PushNotificationDevicesDeviceInstance, "refId"> & {refId: string[]}>({refId: refIds});

  const deviceResult = await db.findDevices(searchQuery);

  if(deviceResult.isFailure){
    return Result.fail(GetDevicesByRefIdError.UNKNOWN);
  }

  return Result.ok(deviceResult.success);
}