import { Result } from "../../domain/core/types/Result.js";
import { EventsService } from "../../domain/events/EventsService.js";
import { PushNotificationDevicesDeviceInstance, PushNotificationDevicesDeviceValues } from "../../domain/pushNotificationDevices/entities/Device/Device.model.js";
import { PushNotificationDevicesDatabase } from "../../domain/pushNotificationDevices/pushNotificationDevices.database.js";
import { AddTokenToDeviceError, addTokenToDevice } from "./service/addTokenToDevice.js";
import { CreateDeviceError, createDevice } from "./service/createDevice.js";
import { DeleteDeviceByRefIdError, deleteDeviceByRefId } from "./service/deleteDeviceByRefId.js";
import { GetDeviceByRefIdError, getDeviceByRefId } from "./service/getDeviceByRefId.js";
import { GetDevicesByRefIdError, getDevicesByRefId } from "./service/getDevicesByRefId.js";
import { RegisterDeviceError, registerDevice } from "./service/registerDevice.js";
import { RemoveTokenFromDeviceError, removeTokenFromDevice } from "./service/removeTokenFromDevice.js";
import { UnregisterDeviceError, unregisterDevice } from "./service/unregisterDevice.js";
import { UpdateDeviceByRefIdError, updateDeviceByRefId } from "./service/updateDeviceByRefId.js";


interface PushNotificationDevicesServiceParams {
  pushNotificationDevicesDatabase: PushNotificationDevicesDatabase;
  eventsService: EventsService;
}

export class PushNotificationDevicesService {
  private _pushNotificationDevicesDatabase: PushNotificationDevicesDatabase;
  private _eventsService: EventsService;

  constructor(params: PushNotificationDevicesServiceParams) {
    this._pushNotificationDevicesDatabase = params.pushNotificationDevicesDatabase;
    this._eventsService = params.eventsService;
  }

  async getDeviceByRefId(refId: string): Promise<Result<PushNotificationDevicesDeviceInstance, GetDeviceByRefIdError>> {
    return await getDeviceByRefId(this._pushNotificationDevicesDatabase, refId);
  }

  async getDevicesByRefIds(refIds: string[]): Promise<Result<PushNotificationDevicesDeviceInstance[], GetDevicesByRefIdError>> {
    return await getDevicesByRefId(this._pushNotificationDevicesDatabase, refIds);
  }

  async updateDeviceByRefId(refId: string, values: Partial<PushNotificationDevicesDeviceValues>): Promise<Result<PushNotificationDevicesDeviceInstance, UpdateDeviceByRefIdError>> {
    return await updateDeviceByRefId(this._pushNotificationDevicesDatabase, this._eventsService, refId, values);
  }

  async createDevice(device: Partial<PushNotificationDevicesDeviceInstance> & PushNotificationDevicesDeviceValues): Promise<Result<PushNotificationDevicesDeviceInstance, CreateDeviceError>> {
    return await createDevice(this._pushNotificationDevicesDatabase, this._eventsService, device);
  }

  async deleteDeviceByRefId(refId: string): Promise<Result<PushNotificationDevicesDeviceInstance, DeleteDeviceByRefIdError>> {
    return await deleteDeviceByRefId(this._pushNotificationDevicesDatabase, this._eventsService, refId);
  }

  async addTokenToDevice(refId: string, token: string): Promise<Result<PushNotificationDevicesDeviceInstance, AddTokenToDeviceError>> {
    return await addTokenToDevice(this._pushNotificationDevicesDatabase, this._eventsService, refId, token);
  }

  async removeTokenFromDevice(refId: string, token: string): Promise<Result<PushNotificationDevicesDeviceInstance, RemoveTokenFromDeviceError>> {
    return await removeTokenFromDevice(this._pushNotificationDevicesDatabase, this._eventsService, refId, token);
  }

  async registerDevice(refId: string, token: string): Promise<Result<PushNotificationDevicesDeviceInstance, RegisterDeviceError>> {
    return await registerDevice(this, this._eventsService, refId, token);
  }

  async unregisterDevice(refId: string, token: string): Promise<Result<PushNotificationDevicesDeviceInstance | undefined, UnregisterDeviceError>> {
    return await unregisterDevice(this, this._eventsService, refId, token);
  }
}
