import {Result} from '../../../../domain/core/types/Result.js';
import {Operation} from '../../../../domain/operations/types.js';
import { PushNotificationDevicesDatabase } from '../../../../domain/pushNotificationDevices/pushNotificationDevices.database.js';
import { PushNotificationDevicesDeviceInstance, PushNotificationDevicesDeviceValues } from '../../../../domain/pushNotificationDevices/entities/Device/Device.model.js';
import { MongoDBDatabase, MongoDBDatabaseParams } from '../MongoDBDatabase.js';
import { DBDeviceInstance, DBDeviceToItem, DeviceInstanceToDBItem, dbDeviceSchema } from './device/DeviceDBModel.js';  
import { Model } from 'mongoose';
import { findOne } from '../core/operations/findOne.js';
import { findMany } from '../core/operations/findMany.js';
import { removeOne } from '../core/operations/removeOne.js';
import { createOne } from '../core/operations/createOne.js';
import { createMany } from '../core/operations/createMany.js';
import { editOne } from '../core/operations/editOne.js';

export class MongoDBPushNotificationDevicesDatabase extends MongoDBDatabase implements PushNotificationDevicesDatabase {
  private deviceModel: Model<DBDeviceInstance>

  constructor(params: MongoDBDatabaseParams){
    super(params);

    const connection = this.getConnection();

    connection.model("Device", dbDeviceSchema);

    this.deviceModel = connection.model("Device")
  }

  // ------------------ //
  // DEVICE
  // ------------------ //
  async addDevice<T extends PushNotificationDevicesDeviceInstance, K extends PushNotificationDevicesDeviceValues>(instance: Partial<T> & K): Promise<Result<PushNotificationDevicesDeviceInstance, undefined>> {
    return await createOne(this.deviceModel, DeviceInstanceToDBItem, DBDeviceToItem)(instance);
  }

  async addDevices<T extends PushNotificationDevicesDeviceInstance, K extends PushNotificationDevicesDeviceValues>(instances: (Partial<T> & K)[]): Promise<Result<PushNotificationDevicesDeviceInstance[], undefined>> {
    return await createMany(this.deviceModel, DeviceInstanceToDBItem, DBDeviceToItem)(instances);
  }

  async editDevice<T extends PushNotificationDevicesDeviceInstance>(
    searchBy: Partial<Record<keyof T, Operation>>,
    newValues: Partial<Record<keyof T, Operation>>
  ): Promise<Result<PushNotificationDevicesDeviceInstance, undefined>> {
    return await editOne(this.deviceModel, DBDeviceToItem)(searchBy, newValues);
  }

  async findDevice<T extends PushNotificationDevicesDeviceInstance>(filters: Partial<Record<keyof T, Operation>>): Promise<Result<PushNotificationDevicesDeviceInstance, undefined>> {
    return await findOne(this.deviceModel, DBDeviceToItem)(filters);
  }

  async findDevices<T extends PushNotificationDevicesDeviceInstance>(filters: Partial<Record<keyof T, Operation>>): Promise<Result<PushNotificationDevicesDeviceInstance[], undefined>> {
    return await findMany(this.deviceModel, DBDeviceToItem)(filters);
  }

  async removeDevice<T extends PushNotificationDevicesDeviceInstance>(criteria: Partial<Record<keyof T, Operation>>): Promise<Result<PushNotificationDevicesDeviceInstance, undefined>> {
    return await removeOne(this.deviceModel, DBDeviceToItem)(criteria);
  }
}
