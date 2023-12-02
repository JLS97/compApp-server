import CreateMongoDBStore from 'connect-mongodb-session';
import session from 'express-session';
import {ENV} from '../../env.js';
import {MongoDBAuthenticationDatabase} from '../../infrastructure/database/mongoDB/authentication/MongoDBAuthenticationDatabase.js';

let mongoDBAuthenticationDatabase: MongoDBAuthenticationDatabase;

const getMongoDBAuthenticationDatabase = () => {
  if (mongoDBAuthenticationDatabase) {
    return mongoDBAuthenticationDatabase;
  }

  mongoDBAuthenticationDatabase = new MongoDBAuthenticationDatabase({
    connectionUrl: ENV.AUTHENTICATION_DATABASE_MONGODB_URL,
  });

  return mongoDBAuthenticationDatabase;
};

export function getAuthenticationDatabase() {
  switch (ENV.AUTHENTICATION_DATABASE_TYPE) {
    case 'mongodb':
      return getMongoDBAuthenticationDatabase();
    default:
      throw new Error(`Authentication database not supported. Received: ${ENV.AUTHENTICATION_DATABASE_TYPE}`);
  }
}

const getMongoDBSessionStore = (s: typeof session) => {
  const MongoDBStore = CreateMongoDBStore(s);
  const store = new MongoDBStore({
    uri: ENV.AUTHENTICATION_DATABASE_MONGODB_URL,
    collection: 'sessions',
  });

  return store;
};

export function getSessionStore(s: typeof session) {
  switch (ENV.AUTHENTICATION_DATABASE_TYPE) {
    case 'mongodb':
      return getMongoDBSessionStore(s);
    default:
      throw new Error(`Session store not supported for authentication database type of ${ENV.AUTHENTICATION_DATABASE_TYPE}`);
  }
}
