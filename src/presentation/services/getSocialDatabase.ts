import {ENV} from '../../env.js';
import { MongoDBSocialDatabase } from '../../infrastructure/database/mongoDB/social/MongoDBSocial.js';

let mongoDBSocialDatabase: MongoDBSocialDatabase;

const getMongoDBSocialDatabase = () => {
  if (mongoDBSocialDatabase) {
    return mongoDBSocialDatabase;
  }

  mongoDBSocialDatabase = new MongoDBSocialDatabase({
    connectionUrl: ENV.SOCIAL_DATABASE_MONGODB_URL,
  });

  return mongoDBSocialDatabase;
};

export function getSocialDatabase() {
  switch (ENV.SOCIAL_DATABASE_TYPE) {
    case 'mongodb':
      return getMongoDBSocialDatabase();
    default:
      throw new Error(`Social database not supported. Received: ${ENV.SOCIAL_DATABASE_TYPE}`);
  }
}
