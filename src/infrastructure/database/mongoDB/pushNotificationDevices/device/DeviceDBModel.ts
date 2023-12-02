import {Document, Schema} from 'mongoose';
import { PushNotificationDevicesDevice, PushNotificationDevicesDeviceInstance, PushNotificationDevicesDeviceValues } from '../../../../../domain/pushNotificationDevices/entities/Device/Device.model.js';

export interface DBDeviceValue {
  refId: string;
  tokens: string[];
}

export interface DBDeviceInstance extends DBDeviceValue {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const dbDeviceSchema = new Schema<DBDeviceInstance>(
  {
    id: {type: String, required: true, unique: true},
    refId: {type: String, required: true},
    tokens: [{type: String}],
  },
  {
    collection: 'pushNotification_devices',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

export function DBDeviceToItem(dbItem: DBDeviceValue & Document): PushNotificationDevicesDevice {
  return new PushNotificationDevicesDevice({
    ...dbItem.toJSON(),
  });
}

export function DeviceValueToDBItem(item: PushNotificationDevicesDeviceValues): DBDeviceValue {
  const candidate = new PushNotificationDevicesDevice(item);
  return {
    ...candidate.values(),
  };
}

export function DeviceInstanceToDBItem(item: PushNotificationDevicesDeviceInstance): DBDeviceInstance {
  const candidate = new PushNotificationDevicesDevice(item);
  return {
    ...candidate.instanceValues(),
  };
}
