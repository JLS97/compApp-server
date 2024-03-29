import { PushNotificationDevicesDeviceInstance } from "./entities/Device/Device.model.js";

export const PushNotificationDevicesEvents = {
  PUSH_NOTIFICATION_DEVICES_DEVICE_CREATED: "PUSH_NOTIFICATION_DEVICES_DEVICE_CREATED",
  PUSH_NOTIFICATION_DEVICES_DEVICE_UPDATED: "PUSH_NOTIFICATION_DEVICES_DEVICE_UPDATED",
  PUSH_NOTIFICATION_DEVICES_DEVICE_REMOVED: "PUSH_NOTIFICATION_DEVICES_DEVICE_REMOVED",
  PUSH_NOTIFICATION_DEVICES_DEVICE_TOKEN_ADDED: "PUSH_NOTIFICATION_DEVICES_DEVICE_TOKEN_ADDED",
  PUSH_NOTIFICATION_DEVICES_DEVICE_TOKEN_REMOVED: "PUSH_NOTIFICATION_DEVICES_DEVICE_TOKEN_REMOVED",
  PUSH_NOTIFICATION_DEVICES_DEVICE_REGISTERED: "PUSH_NOTIFICATION_DEVICES_DEVICE_REGISTERED",
  PUSH_NOTIFICATION_DEVICES_DEVICE_UNREGISTERED: "PUSH_NOTIFICATION_DEVICES_DEVICE_UNREGISTERED",
} as const;

export type PushNotificationDevicesDeviceCreatedEventPayload = PushNotificationDevicesDeviceInstance;

export type PushNotificationDevicesDeviceUpdatedEventPayload = PushNotificationDevicesDeviceInstance;

export type PushNotificationDevicesDeviceRemovedEventPayload = PushNotificationDevicesDeviceInstance;

export type PushNotificationDevicesDeviceTokenAddedEventPayload = PushNotificationDevicesDeviceInstance;

export type PushNotificationDevicesDeviceTokenRemovedEventPayload = PushNotificationDevicesDeviceInstance;

export type PushNotificationDevicesDeviceRegisteredEventPayload = PushNotificationDevicesDeviceInstance;

export type PushNotificationDevicesDeviceUnregisteredEventPayload = PushNotificationDevicesDeviceInstance;