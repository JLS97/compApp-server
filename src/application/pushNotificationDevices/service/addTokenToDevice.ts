import * as yup from 'yup';
import { Result } from "../../../domain/core/types/Result.js";
import { CoreResponses } from "../../../domain/core/core.responses.js";
import { EventsService } from "../../../domain/events/EventsService.js";
import { PushNotificationDevicesDeviceInstance } from "../../../domain/pushNotificationDevices/entities/Device/Device.model.js";
import { PushNotificationDevicesDatabase } from "../../../domain/pushNotificationDevices/pushNotificationDevices.database.js";
import { PushNotificationDevicesDeviceSchemas } from '../../../domain/pushNotificationDevices/entities/Device/Device.schemas.js';
import { prepareQueryOperation } from '../../../domain/operations/prepareQueryOperation.js';
import { prepareUpdateOperation } from '../../../domain/operations/prepareUpdateOperation.js';
import { PushNotificationDevicesResponses } from '../pushNotificationDevices.responses.js';
import { PushNotificationDevicesDeviceTokenAddedEventPayload, PushNotificationDevicesEvents } from '../../../domain/pushNotificationDevices/pushNotificationDevices.events.js';
import { UpdateOperations } from '../../../domain/operations/UpdateOperations.js';
import { Operation } from '../../../domain/operations/types.js';

export const AddTokenToDeviceError = {
  ...CoreResponses.InvalidRequest,
  ...PushNotificationDevicesResponses.NotFound,
} as const;
export type AddTokenToDeviceError = typeof AddTokenToDeviceError[keyof typeof AddTokenToDeviceError];

export async function addTokenToDevice(db: PushNotificationDevicesDatabase, events: EventsService, refId: string, token: string): Promise<Result<PushNotificationDevicesDeviceInstance, AddTokenToDeviceError>>{
  const schema = yup.object().shape({
    refId: PushNotificationDevicesDeviceSchemas.refId.required(),
    token: PushNotificationDevicesDeviceSchemas.token.required(),
  });

  if (!schema.isValidSync({refId, token})) {
    return Result.fail(AddTokenToDeviceError.INVALID_REQUEST);
  }

  const searchQuery = prepareQueryOperation<PushNotificationDevicesDeviceInstance>({refId: refId});
  const updateQuery = prepareUpdateOperation<PushNotificationDevicesDeviceInstance & {token: Operation}>({token: UpdateOperations.push(token)});

  const result = await db.editDevice(searchQuery, updateQuery);

  if (result.isFailure) {
    return Result.fail(AddTokenToDeviceError.PUSH_NOTIFICATION_DEVICES_DEVICE_NOT_FOUND);
  }

  events.emit<PushNotificationDevicesDeviceTokenAddedEventPayload>(PushNotificationDevicesEvents.PUSH_NOTIFICATION_DEVICES_DEVICE_TOKEN_ADDED, result.success);

  return Result.ok(result.success)
}