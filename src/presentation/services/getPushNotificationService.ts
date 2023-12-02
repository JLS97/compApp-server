import {ENV} from '../../env.js';
import { FCMPushNotificationsService } from '../../infrastructure/pushNotifications/fcm/FCMPushNotificationsService.js';
import { NoopPushNotificationService } from '../../infrastructure/pushNotifications/noop/NoopPushNotificationsService.js';

let fcmPushNotificationService: FCMPushNotificationsService;
let noopPushNotificationService: NoopPushNotificationService;

const getFCMPushNotificationService = () => {
  if (fcmPushNotificationService) {
    return fcmPushNotificationService;
  }

  fcmPushNotificationService = new FCMPushNotificationsService({
    dryRun: ENV.PUSH_NOTIFICATIONS_FCM_DRY_RUN
  });

  return fcmPushNotificationService;
};

const getNoopPushNotificationService = () => {
  if (noopPushNotificationService) {
    return noopPushNotificationService;
  }

  noopPushNotificationService = new NoopPushNotificationService();

  return noopPushNotificationService;
};

export function getPushNotificationService() {
  switch (ENV.PUSH_NOTIFICATIONS_SERVICE_TYPE) {
    case 'fcm':
      return getFCMPushNotificationService();
    case 'none':
      return getNoopPushNotificationService();
    default:
      throw new Error(`PushNotification service not supported. Received: ${ENV.PUSH_NOTIFICATIONS_SERVICE_TYPE}`);
  }
}
