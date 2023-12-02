import { PushNotificationsService } from "../../../domain/pushNotifications/PushNotificationsService.js";
import { MulticastPreparedPushNotification, SendPushNotificationResponse } from "../../../domain/pushNotifications/types.js";

export class NoopPushNotificationService extends PushNotificationsService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendMulticastPushNotification(pushNotification: MulticastPreparedPushNotification, dryRun?: boolean): Promise<SendPushNotificationResponse> {
    return {
      failures: [],
      successes: [],
    }
  }
}