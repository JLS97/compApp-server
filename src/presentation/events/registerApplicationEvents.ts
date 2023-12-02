import {registerAuthenticationEvents} from './authentication/registerAuthenticationEvents.js';
import { registerActivityEvents } from './activity/registerActivityEvents.js';
import { registerPushNotificationDevicesEvents } from './pushNotificationDevices/registerPushNotificationDevicesEvents.js';
import { registerSocialEvents } from './social/registerSocialEvents.js';

export function registerApplicationEvents() {
  registerAuthenticationEvents();
  registerPushNotificationDevicesEvents();
  registerSocialEvents();
  registerActivityEvents();
}
