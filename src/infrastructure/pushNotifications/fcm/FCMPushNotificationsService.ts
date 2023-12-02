import { App } from "firebase-admin/app";
import { PushNotificationsService } from "../../../domain/pushNotifications/PushNotificationsService.js";
import { getFirebase } from "../../firebase/getFirebase.js";
import { getMessaging } from "firebase-admin/messaging";
import { sendMulticastPushNotification } from "./sendMulticastPushNotification.js";
import { MulticastPreparedPushNotification, SendPushNotificationResponse } from "../../../domain/pushNotifications/types.js";

interface FCMPushNotificationsServiceParams {
  dryRun?: boolean
}

export class FCMPushNotificationsService extends PushNotificationsService {
  private _firebase: App;
  private _dryRun: boolean

  constructor(params?: FCMPushNotificationsServiceParams) {
    super();
    this._firebase = getFirebase();
    this._dryRun = !!params?.dryRun;
  }

  async sendMulticastPushNotification(pushNotification: MulticastPreparedPushNotification, dryRun?: boolean): Promise<SendPushNotificationResponse>{
    const firebaseMessaging = getMessaging(this._firebase);
    const response = await sendMulticastPushNotification(firebaseMessaging, pushNotification, {
      dryRun: dryRun || this._dryRun,
    });

    return response;
  }
}