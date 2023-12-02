import * as yup from 'yup';
import { PushNotificationDevicesDeviceSchemas } from './Device.schemas.js';
import { Entity, EntityValues } from '../../../core/entities/Entity/Entity.model.js';
import { PartialDeep } from 'type-fest';

export interface PushNotificationDevicesDeviceValues {
  refId: string;
  tokens: string[];
}

export type PushNotificationDevicesDeviceInstance = EntityValues & PushNotificationDevicesDeviceValues;

export class PushNotificationDevicesDevice extends Entity implements PushNotificationDevicesDeviceInstance {
  refId: string;
  tokens: string[];

  static _updateValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    refId: PushNotificationDevicesDeviceSchemas.refId,
    tokens: PushNotificationDevicesDeviceSchemas.tokens,
  });

  static _createValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...PushNotificationDevicesDevice._updateValueSchema.fields,
    refId: PushNotificationDevicesDeviceSchemas.refId.required(),
    tokens: PushNotificationDevicesDeviceSchemas.tokens.required(),
  });

  static _instanceSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...Entity._instanceSchema.fields,
    ...PushNotificationDevicesDevice._createValueSchema.fields,
  });

  constructor(params: PartialDeep<PushNotificationDevicesDeviceInstance>) {
    super(params, PushNotificationDevicesDevice._instanceSchema);
  }

  isValidUpdateValue(): boolean {
    return super._isValidValue(PushNotificationDevicesDevice._updateValueSchema)
  }

  isValidCreateValue(): boolean {
    return super._isValidValue(PushNotificationDevicesDevice._createValueSchema)
  }

  isValidInstance(): boolean {
    return super._isValidValue(PushNotificationDevicesDevice._instanceSchema)
  }

  values<T = PushNotificationDevicesDeviceValues>(): T {
    return super._values<T>(PushNotificationDevicesDevice._createValueSchema);
  }

  instanceValues<T = PushNotificationDevicesDeviceInstance>(): T {
    return super._values<T>(PushNotificationDevicesDevice._instanceSchema);
  }
}
