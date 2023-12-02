import {ENV} from '../../env.js';
import { MongoDBPushNotificationDevicesDatabase } from '../../infrastructure/database/mongoDB/pushNotificationDevices/MongoDBPushNotificationDevicesDatabase.js';

let mongoDBPushNotificationDevicesDatabase: MongoDBPushNotificationDevicesDatabase;

const getMongoDBPushNotificationDevicesDatabase = () => {
  if (mongoDBPushNotificationDevicesDatabase) {
    return mongoDBPushNotificationDevicesDatabase;
  }

  mongoDBPushNotificationDevicesDatabase = new MongoDBPushNotificationDevicesDatabase({
    connectionUrl: ENV.PUSH_NOTIFICATION_DEVICES_DATABASE_MONGODB_URL,
  });

  return mongoDBPushNotificationDevicesDatabase;
};

export function getPushNotificationDevicesDatabase() {
  switch (ENV.PUSH_NOTIFICATION_DEVICES_DATABASE_TYPE) {
    case 'mongodb':
      return getMongoDBPushNotificationDevicesDatabase();
    default:
      throw new Error(`Push Notification Devices database not supported. Received: ${ENV.PUSH_NOTIFICATION_DEVICES_DATABASE_TYPE}`);
  }
}
