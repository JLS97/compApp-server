import express from 'express';
import {Controllers, type IncomingMessageWithRawBody, Middlewares} from '../../infrastructure/apiRest/index.js';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import {apiRestAuth} from './auth.js';
import { apiRestPushNotificationDevices } from './pushNotificationDevices.js';
import {getPassport, initializePassport} from '../../infrastructure/passport/passport.js';
import {serializeUser} from '../../infrastructure/passport/serializeUser.js';
import {deserializeUser} from '../../infrastructure/passport/deserializeUser.js';
import {AuthenticationService} from '../../application/authentication/authentication.service.js';
import {JwtStrategy} from '../../infrastructure/passport/JwtStrategy.js';
import {ENV} from '../../env.js';
import {LocalStrategy} from '../../infrastructure/passport/LocalStrategy.js';
import {GoogleStrategy} from '../../infrastructure/passport/GoogleStrategy.js';
import {AppleStrategy} from '../../infrastructure/passport/AppleStrategy.js';
import {resolve} from 'path';
import {Path} from '../../config/path.js';
import {getEventService} from '../services/getEventService.js';
import {getLogger} from '../services/getLogger.js';
import {getAuthenticationDatabase, getSessionStore} from '../services/getAuthenticationDatabase.js';
import { FacebookStrategy } from '../../infrastructure/passport/FacebookStrategy.js';
import { apiRestAttachments } from './attachments.js';
import { apiRestActivity } from './activity.js';

const apiRest = express();

apiRest.use(compression());
apiRest.use(helmet());
apiRest.use(hpp());
apiRest.use(cors());
apiRest.use(
  express.json({
    limit: '5mb',
    verify: (req: IncomingMessageWithRawBody, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
apiRest.use(express.urlencoded({extended: true}));
apiRest.use(
  fileUpload({
    useTempFiles: true,
    debug: false,
    tempFileDir: '/tmp/',
    uploadTimeout: 30 * 1000,
    abortOnLimit: true,
    safeFileNames: true,
  })
);
apiRest.use(cookieParser(ENV.AUTHENTICATION_SESSION_SECRET));

/**
 * session.cookie.secure === true. If the inner request is made by HTTP (For example, using Elastic Beanstalk). We have to tell express to trust the EB proxy
 * Docs (Read the whole cookie.secure section): https://www.npmjs.com/package/express-session
 * Solution using Heroku (Same as EB): https://stackoverflow.com/a/63105481/13559862
 */
const cookieSessionConfig: session.CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

if (apiRest.get('env') === 'production') {
  apiRest.set('trust proxy', 1);
  cookieSessionConfig.secure = true;
}

const store = getSessionStore(session);

store.on('error', (error) => {
  loggerService.error('STORE', error);
});

apiRest.use(
  session({
    secret: ENV.AUTHENTICATION_SESSION_SECRET,
    cookie: cookieSessionConfig,
    store,
    resave: true,
    saveUninitialized: false,
  })
);

const loggerService = getLogger();
const eventsService = getEventService();
const authenticationDatabase = getAuthenticationDatabase();

const authenticationService = new AuthenticationService({
  authenticationDatabase,
  events: eventsService,
});

/**
 * Autenticación
 */
apiRest.use(initializePassport());
const passport = getPassport();

apiRest.use(passport.session());
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser(authenticationService));

if (ENV.JWT_AUTHENTICATION_ENABLED) {
  passport.use(
    'jwt',
    JwtStrategy({
      secret: ENV.JWT_SECRET,
      authenticationService,
      loggerService,
    })
  );
}

if (ENV.EMAIL_PASSWORD_AUTHENTICATION_ENABLED) {
  passport.use(
    'local',
    LocalStrategy({
      authenticationService,
      loggerService,
    })
  );
}

if (ENV.GOOGLE_SIGN_IN_ENABLED) {
  passport.use(
    'google-mobile',
    GoogleStrategy({
      callbackUrl: `${ENV.API_REST_BASE_URL}/auth/google/mobile/callback`,
      clientId: ENV.GOOGLE_PROVIDER_TOKEN_CLIENT_ID,
      clientSecret: ENV.GOOGLE_PROVIDER_TOKEN_CLIENT_SECRET,
      authenticationService,
      loggerService,
    })
  );
}

if (ENV.GOOGLE_SIGN_IN_ENABLED) {
  passport.use(
    'google-desktop',
    GoogleStrategy({
      callbackUrl: `${ENV.API_REST_BASE_URL}/auth/google/desktop/callback`,
      clientId: ENV.GOOGLE_PROVIDER_TOKEN_CLIENT_ID,
      clientSecret: ENV.GOOGLE_PROVIDER_TOKEN_CLIENT_SECRET,
      authenticationService,
      loggerService,
    })
  );
}

if (ENV.APPLE_SIGN_IN_ENABLED) {
  passport.use(
    'apple-mobile',
    AppleStrategy({
      callbackUrl: `${ENV.API_REST_BASE_URL}/auth/apple/mobile/callback`,
      clientId: ENV.APPLE_PROVIDER_TOKEN_CLIENT_ID,
      keyId: ENV.APPLE_PROVIDER_TOKEN_KEY_ID,
      privateKeyLocation: resolve(Path.certs, ENV.APPLE_PROVIDER_TOKEN_PRIVATE_KEY_FILE_NAME),
      teamId: ENV.APPLE_PROVIDER_TOKEN_TEAM_ID,
      authenticationService,
      loggerService,
    })
  );
}

if (ENV.APPLE_SIGN_IN_ENABLED) {
  passport.use(
    'apple-desktop',
    AppleStrategy({
      callbackUrl: `${ENV.API_REST_BASE_URL}/auth/apple/desktop/callback`,
      clientId: ENV.APPLE_PROVIDER_TOKEN_CLIENT_ID,
      keyId: ENV.APPLE_PROVIDER_TOKEN_KEY_ID,
      privateKeyLocation: resolve(Path.certs, ENV.APPLE_PROVIDER_TOKEN_PRIVATE_KEY_FILE_NAME),
      teamId: ENV.APPLE_PROVIDER_TOKEN_TEAM_ID,
      authenticationService,
      loggerService,
    })
  );
}

if (ENV.FACEBOOK_SIGN_IN_ENABLED) {
  passport.use(
    'facebook-mobile',
    FacebookStrategy({
      callbackUrl: `${ENV.API_REST_BASE_URL}/auth/facebook/mobile/callback`,
      clientId: ENV.FACEBOOK_PROVIDER_TOKEN_CLIENT_ID,
      clientSecret: ENV.FACEBOOK_PROVIDER_TOKEN_CLIENT_SECRET,
      authenticationService,
      loggerService,
    })
  );
}

if (ENV.FACEBOOK_SIGN_IN_ENABLED) {
  passport.use(
    'facebook-desktop',
    FacebookStrategy({
      callbackUrl: `${ENV.API_REST_BASE_URL}/auth/facebook/desktop/callback`,
      clientId: ENV.FACEBOOK_PROVIDER_TOKEN_CLIENT_ID,
      clientSecret: ENV.FACEBOOK_PROVIDER_TOKEN_CLIENT_SECRET,
      authenticationService,
      loggerService,
    })
  );
}

/**
 * Comprueba que el servidor está en funcionamiento
 */
apiRest.get('/health', Middlewares.errorHandler(Controllers.healthCheckController(), loggerService));

/**
 * Routers internos
 */
apiRest.use('/auth', apiRestAuth);
apiRest.use('/push-notification-devices', apiRestPushNotificationDevices);
apiRest.use('/attachments', apiRestAttachments);
apiRest.use('/activity', apiRestActivity);

/**
 * En caso de que haya un error en el servidor, se controla la respuesta y se evita que las peticiones de otros usuarios se vean frustradas
 */
apiRest.use(Controllers.serverErrorController(loggerService));

/**
 * Si no se encuentra una ruta a la que se hace la petición, se devuelve una respuesta con el formato correcto
 */
apiRest.use(Controllers.routeNotFoundController());

export {apiRest};
