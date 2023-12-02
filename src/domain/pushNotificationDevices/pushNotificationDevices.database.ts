import {Result} from '../core/types/Result.js';
import {Operation} from '../operations/types.js';
import {PushNotificationDevicesDeviceInstance, PushNotificationDevicesDeviceValues} from './entities/Device/Device.model.js';

export abstract class PushNotificationDevicesDatabase {
  /**
   * DEVICE
   */
  abstract findDevice<T extends PushNotificationDevicesDeviceInstance>(
    filters: Partial<Record<keyof T, Operation>>
  ): Promise<Result<PushNotificationDevicesDeviceInstance, undefined>>;
  abstract findDevices<T extends PushNotificationDevicesDeviceInstance>(
    filters: Partial<Record<keyof T, Operation>>
  ): Promise<Result<PushNotificationDevicesDeviceInstance[], undefined>>;
  abstract editDevice<T extends PushNotificationDevicesDeviceInstance>(
    searchBy: Partial<Record<keyof T, Operation>>,
    newValues: Partial<Record<keyof T, Operation>>
  ): Promise<Result<PushNotificationDevicesDeviceInstance, undefined>>;
  abstract removeDevice<T extends PushNotificationDevicesDeviceInstance>(
    criteria: Partial<Record<keyof T, Operation>>
  ): Promise<Result<PushNotificationDevicesDeviceInstance, undefined>>;
  abstract addDevice<T extends PushNotificationDevicesDeviceInstance, K extends PushNotificationDevicesDeviceValues>(
    instance: Partial<T> & K
  ): Promise<Result<PushNotificationDevicesDeviceInstance, undefined>>;
  abstract addDevices<T extends PushNotificationDevicesDeviceInstance, K extends PushNotificationDevicesDeviceValues>(
    instances: (Partial<T> & K)[]
  ): Promise<Result<PushNotificationDevicesDeviceInstance[], undefined>>;
}
