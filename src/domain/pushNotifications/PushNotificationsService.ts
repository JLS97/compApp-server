import { MulticastPreparedPushNotification, SendPushNotificationResponse } from "./types.js";

export abstract class PushNotificationsService {
  abstract sendMulticastPushNotification(pushNotification: MulticastPreparedPushNotification, dryRun?: boolean): Promise<SendPushNotificationResponse>
}