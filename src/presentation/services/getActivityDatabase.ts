import {ENV} from '../../env.js';
import { MongoDBActivityDatabase } from '../../infrastructure/database/mongoDB/activity/MongoDBActivity.js';

let mongoDBActivityDatabase: MongoDBActivityDatabase;

const getMongoDBActivityDatabase = () => {
  if (mongoDBActivityDatabase) {
    return mongoDBActivityDatabase;
  }

  mongoDBActivityDatabase = new MongoDBActivityDatabase({
    connectionUrl: ENV.ACTIVITY_DATABASE_MONGODB_URL,
  });

  return mongoDBActivityDatabase;
};

export function getActivityDatabase() {
  switch (ENV.ACTIVITY_DATABASE_TYPE) {
    case 'mongodb':
      return getMongoDBActivityDatabase();
    default:
      throw new Error(`Activity database not supported. Received: ${ENV.ACTIVITY_DATABASE_TYPE}`);
  }
}