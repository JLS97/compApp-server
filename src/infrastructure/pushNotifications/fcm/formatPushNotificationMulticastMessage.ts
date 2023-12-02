import { MulticastMessage } from "firebase-admin/messaging";
import { formatPushNotificationMessage } from "./formatPushNotificationMessage.js";
import { MulticastPreparedPushNotification } from "../../../domain/pushNotifications/types.js";

export function formatPushNotificationMulticastMessage(item: MulticastPreparedPushNotification): MulticastMessage {
  return {
    ...formatPushNotificationMessage(item),
    tokens: item.tokens,
  }
}