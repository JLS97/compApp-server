import { Messaging } from "firebase-admin/messaging";
import { MulticastPreparedPushNotification } from "../../../domain/pushNotifications/types.js";
import { formatPushNotificationMulticastMessage } from "./formatPushNotificationMulticastMessage.js";

export interface SendMulticastPushNotificationOptions {
  dryRun: boolean
}

export async function sendMulticastPushNotification(client: Messaging, preparedPushNotification: MulticastPreparedPushNotification, options: SendMulticastPushNotificationOptions){
  if(preparedPushNotification.tokens.length <= 0){
    return {
      successes: [],
      failures: [],
    }
  }

  const response = await client.sendEachForMulticast(formatPushNotificationMulticastMessage(preparedPushNotification), options.dryRun);

  const failures = response.responses.filter(item => !item.success).map(item => {
    return {
      code: item.error.code,
      message: item.error.message,
      stack: item.error.stack,
    }
  });
  const successes = response.responses.filter(item => item.success).map(item => item.messageId as string);

  return {
    successes,
    failures,
  }
}