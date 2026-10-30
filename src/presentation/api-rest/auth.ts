import express from 'express';
import {Controllers, Middlewares, ServerResponseCode, ServerResponseStatus, sendResponse} from '../../infrastructure/apiRest/index.js';
import {AuthenticationService} from '../../application/authentication/authentication.service.js';
import {ENV} from '../../env.js';
import {getLogger} from '../services/getLogger.js';
import {getEventService} from '../services/getEventService.js';
import {getAuthenticationDatabase} from '../services/getAuthenticationDatabase.js';

const apiRestAuth = express.Router();

const loggerService = getLogger();
const eventsService = getEventService();

const authenticationDatabase = getAuthenticationDatabase();

const authenticationService = new AuthenticationService({
  authenticationDatabase,
  events: eventsService,
});

/**
 * Límite compartido por las rutas que reciben credenciales para frenar ataques de fuerza bruta.
 * /refresh queda fuera porque el refresh token es aleatorio y no se puede adivinar, y los clientes lo llaman cada pocos minutos
 */
const credentialsRateLimiter = Middlewares.rateLimiter({
  windowMs: ENV.AUTHENTICATION_RATE_LIMIT_WINDOW_MS,
  maxRequests: ENV.AUTHENTICATION_RATE_LIMIT_MAX_REQUESTS,
});

/**
 * Crea un proveedor de autenticación mediante email
 */
apiRestAuth.post(
  '/signup',
  Middlewares.isFeaturedEnabled(ENV.EMAIL_PASSWORD_AUTHENTICATION_ENABLED),
  credentialsRateLimiter,
  Middlewares.errorHandler(
    Controllers.auth.signupController({
      authenticationService,
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      loggerService,
    }),
    loggerService
  )
);

/**
 * Inicia sesión mediante un proveedor de autenticación de email
 */
apiRestAuth.post(
  '/login',
  Middlewares.isFeaturedEnabled(ENV.EMAIL_PASSWORD_AUTHENTICATION_ENABLED),
  credentialsRateLimiter,
  Middlewares.errorHandler(
    Controllers.auth.loginController({
      authenticationService,
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      loggerService,
    }),
    loggerService
  )
);

/**
 * Recupera la información de las cuentas y el proveedor de autenticación a partir de un access token
 */
apiRestAuth.get(
  '/info',
  Middlewares.isFeaturedEnabled(ENV.JWT_AUTHENTICATION_ENABLED),
  Middlewares.authorization.requireAccessToken({
    loggerService,
  }),
  Middlewares.errorHandler(Controllers.auth.infoController(), loggerService)
);

/**
 * Crea una cuenta personal vinculada al proveedor de autenticación del access token.
 * El access token actual no incluye la cuenta nueva, así que el cliente debe llamar a /refresh para obtener uno que sí la incluya
 */
apiRestAuth.post(
  '/account',
  Middlewares.isFeaturedEnabled(ENV.JWT_AUTHENTICATION_ENABLED),
  Middlewares.authorization.requireAccessToken({
    loggerService,
  }),
  Middlewares.errorHandler(
    Controllers.auth.createAccountController({
      authenticationService,
    }),
    loggerService
  )
);

/**
 * Refresca un access token a partir de un refresh token
 */
apiRestAuth.post(
  '/refresh',
  Middlewares.isFeaturedEnabled(ENV.JWT_AUTHENTICATION_ENABLED),
  Middlewares.errorHandler(
    Controllers.auth.refreshTokenController({
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      authenticationService,
    }),
    loggerService
  )
);

/**
 * Respuesta de éxito en la autenticación oauth cuando simplemente se quiere mostrar un mensaje de éxito. Perfecto para móvil mediante webview
 */
apiRestAuth.get('/callback', (_, res) => sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS));

/**
 * Punto de entrada de la autenticación con google para móvil
 */
apiRestAuth.get(
  '/google/mobile',
  Middlewares.isFeaturedEnabled(ENV.GOOGLE_SIGN_IN_ENABLED),
  Middlewares.errorHandler(
    Controllers.auth.googleController({
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      authenticationService,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      strategyName: 'google-mobile',
      loggerService,
    }),
    loggerService
  )
);

/**
 * Callback en la autenticación con google para móvil
 */
apiRestAuth.get(
  '/google/mobile/callback',
  Middlewares.isFeaturedEnabled(ENV.GOOGLE_SIGN_IN_ENABLED),
  Middlewares.errorHandler(
    Controllers.auth.googleController({
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      authenticationService,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      strategyName: 'google-mobile',
      loggerService,
      onSuccess: (res, credentials) => {
        res.redirect(`${ENV.GOOGLE_PROVIDER_REDIRECTION_URL_MOBILE}?accessToken=${credentials.accessToken}&refreshToken=${credentials.refreshToken}`);
      },
    }),
    loggerService
  )
);

/**
 * Punto de entrada de la autenticación con google para web
 */
apiRestAuth.get(
  '/google/desktop',
  Middlewares.isFeaturedEnabled(ENV.GOOGLE_SIGN_IN_ENABLED),
  Middlewares.errorHandler(
    Controllers.auth.googleController({
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      authenticationService,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      strategyName: 'google-desktop',
      loggerService,
    }),
    loggerService
  )
);

/**
 * Callback en la autenticación con google para web
 */
apiRestAuth.get(
  '/google/desktop/callback',
  Middlewares.isFeaturedEnabled(ENV.GOOGLE_SIGN_IN_ENABLED),
  Middlewares.errorHandler(
    Controllers.auth.googleController({
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      authenticationService,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      strategyName: 'google-desktop',
      loggerService,
      onSuccess: (res, credentials) => {
        res.redirect(`${ENV.GOOGLE_PROVIDER_REDIRECTION_URL_DESKTOP}?accessToken=${credentials.accessToken}&refreshToken=${credentials.refreshToken}`);
      },
    }),
    loggerService
  )
);

/**
 * Punto de entrada en la autenticación con apple para móvil
 */
apiRestAuth.get(
  '/apple/mobile',
  Middlewares.isFeaturedEnabled(ENV.APPLE_SIGN_IN_ENABLED),
  Middlewares.errorHandler(
    Controllers.auth.appleController({
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      authenticationService,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      strategyName: 'apple-mobile',
      loggerService,
    }),
    loggerService
  )
);

/**
 * Callback en la autenticación con apple para móvil
 */
apiRestAuth.post(
  '/apple/mobile/callback',
  Middlewares.isFeaturedEnabled(ENV.APPLE_SIGN_IN_ENABLED),
  Middlewares.errorHandler(
    Controllers.auth.appleController({
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      authenticationService,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      strategyName: 'apple-mobile',
      loggerService,
      onSuccess: (res, credentials) => {
        res.redirect(`${ENV.APPLE_PROVIDER_REDIRECTION_URL_MOBILE}?accessToken=${credentials.accessToken}&refreshToken=${credentials.refreshToken}`);
      },
    }),
    loggerService
  )
);

/**
 * Punto de entrada en la autenticación con apple para web
 */
apiRestAuth.get(
  '/apple/desktop',
  Middlewares.isFeaturedEnabled(ENV.APPLE_SIGN_IN_ENABLED),
  Middlewares.errorHandler(
    Controllers.auth.appleController({
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      authenticationService,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      strategyName: 'apple-desktop',
      loggerService,
    }),
    loggerService
  )
);

/**
 * Callback en la autenticación con apple para web
 */
apiRestAuth.post(
  '/apple/desktop/callback',
  Middlewares.isFeaturedEnabled(ENV.APPLE_SIGN_IN_ENABLED),
  Middlewares.errorHandler(
    Controllers.auth.appleController({
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      authenticationService,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      strategyName: 'apple-desktop',
      loggerService,
      onSuccess: (res, credentials) => {
        res.redirect(`${ENV.APPLE_PROVIDER_REDIRECTION_URL_DESKTOP}?accessToken=${credentials.accessToken}&refreshToken=${credentials.refreshToken}`);
      },
    }),
    loggerService
  )
);

/**
 * Punto de entrada en la autenticación con facebook para móvil
 */
apiRestAuth.get(
  '/facebook/mobile',
  Middlewares.isFeaturedEnabled(ENV.FACEBOOK_SIGN_IN_ENABLED),
  Middlewares.errorHandler(
    Controllers.auth.facebookController({
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      authenticationService,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      strategyName: 'facebook-mobile',
      loggerService,
    }),
    loggerService
  )
);

/**
 * Callback en la autenticación con facebook para móvil
 */
apiRestAuth.get(
  '/facebook/mobile/callback',
  Middlewares.isFeaturedEnabled(ENV.FACEBOOK_SIGN_IN_ENABLED),
  Middlewares.errorHandler(
    Controllers.auth.facebookController({
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      authenticationService,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      strategyName: 'facebook-mobile',
      loggerService,
      onSuccess: (res, credentials) => {
        res.redirect(`${ENV.FACEBOOK_PROVIDER_REDIRECTION_URL_MOBILE}?accessToken=${credentials.accessToken}&refreshToken=${credentials.refreshToken}`);
      },
    }),
    loggerService
  )
);

/**
 * Punto de entrada en la autenticación con facebook para web
 */
apiRestAuth.get(
  '/facebook/desktop',
  Middlewares.isFeaturedEnabled(ENV.FACEBOOK_SIGN_IN_ENABLED),
  Middlewares.errorHandler(
    Controllers.auth.facebookController({
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      authenticationService,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      strategyName: 'facebook-desktop',
      loggerService,
    }),
    loggerService
  )
);

/**
 * Callback en la autenticación con facebook para web
 */
apiRestAuth.get(
  '/facebook/desktop/callback',
  Middlewares.isFeaturedEnabled(ENV.FACEBOOK_SIGN_IN_ENABLED),
  Middlewares.errorHandler(
    Controllers.auth.facebookController({
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      authenticationService,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      strategyName: 'facebook-desktop',
      loggerService,
      onSuccess: (res, credentials) => {
        res.redirect(`${ENV.FACEBOOK_PROVIDER_REDIRECTION_URL_DESKTOP}?accessToken=${credentials.accessToken}&refreshToken=${credentials.refreshToken}`);
      },
    }),
    loggerService
  )
);

/**
 * Solicita un cambio de contraseña
 */
apiRestAuth.post(
  '/reset-password',
  Middlewares.isFeaturedEnabled(ENV.EMAIL_PASSWORD_AUTHENTICATION_ENABLED),
  credentialsRateLimiter,
  Middlewares.errorHandler(
    Controllers.auth.requestEmailPasswordResetController({
      authenticationService,
    }),
    loggerService
  )
);

/**
 * Permite un cambio de email de un proveedor de autenticación de email
 */
apiRestAuth.post(
  '/change-email',
  Middlewares.isFeaturedEnabled(ENV.EMAIL_PASSWORD_AUTHENTICATION_ENABLED),
  Middlewares.authorization.requireAccessToken({loggerService}),
  Middlewares.errorHandler(
    Controllers.auth.changeEmailController({
      authenticationService,
    }),
    loggerService
  )
);

/**
 * Permite un cambio de contraseña de un proveedor de autenticación de email.
 * Invalida todas las sesiones del proveedor y devuelve credenciales nuevas para la sesión actual
 */
apiRestAuth.post(
  '/change-password',
  Middlewares.isFeaturedEnabled(ENV.EMAIL_PASSWORD_AUTHENTICATION_ENABLED),
  credentialsRateLimiter,
  Middlewares.authorization.requireAccessToken({loggerService}),
  Middlewares.errorHandler(
    Controllers.auth.changeEmailPasswordController({
      authenticationService,
      accessTokenExpiresInMs: ENV.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      accessTokenSecret: ENV.JWT_SECRET,
      refreshTokenExpiresInMs: ENV.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
    }),
    loggerService
  )
);

/**
 * Permite un cambio de contraseña de un proveedor de autenticación de email a partir de un código
 */
apiRestAuth.post(
  '/change-password/code',
  Middlewares.isFeaturedEnabled(ENV.EMAIL_PASSWORD_AUTHENTICATION_ENABLED),
  credentialsRateLimiter,
  Middlewares.errorHandler(
    Controllers.auth.changeEmailPasswordByCodeController({
      authenticationService,
    }),
    loggerService
  )
);

export {apiRestAuth};
