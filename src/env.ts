function stringToNumber(input: string, defaultValue: number): number {
  const parsedNumber = +input;

  if (isNaN(parsedNumber) || !isFinite(parsedNumber)) {
    return defaultValue;
  }

  return parsedNumber;
}

function stringToBoolean(input: string): boolean {
  return input === '1';
}

function stringToArray(input: string): string[]{
  if(!input){
    return [];
  }

  return input.split(",");
}

type SocketMonitorizationMode = 'development' | 'production';

export const ENV = (() => {
  const socketMonitorizationMode = ['development', 'production'].includes(process.env.SOCKET_MONITORIZATION_USERNAME)
    ? (process.env.SOCKET_MONITORIZATION_USERNAME as SocketMonitorizationMode)
    : 'production';

  return {
    /**
     * Especifica en qué modo se tiene que iniciar Node. Valores permitidos: development | production
     */
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    /**
     * Especifica cuál es el entorno actual de la aplicación. Valores permitidos: development | staging | production
     */
    APP_ENV: process.env.APP_ENV ?? 'development',
    /**
     * Puerto sobre el que se escucharán las peticiones a la api rest
     */
    API_REST_PORT: stringToNumber(process.env.API_REST_PORT, 5300) ?? 5300,
    /**
     * Url base del propio servidor
     */
    API_REST_BASE_URL: process.env.API_REST_BASE_URL ?? '',
    /**
     * Tipo de logger a utilizar. Los valores permitidos son: none | console
     */
    LOGGER_TYPE: process.env.LOGGER_TYPE ?? 'none',
    /**
     * Tipo de servicio de eventos a utilizar. Los valores permitidos son: none | node
     */
    EVENT_SERVICE_TYPE: process.env.EVENT_SERVICE_TYPE ?? 'none',
    /**
     * Tipo de servicio de cronjobs a utilizar. Los valores permitidos son: none | node
     */
    CRONJOB_SERVICE_TYPE: process.env.CRONJOB_SERVICE_TYPE ?? 'none',
    /**
     * Tipo de servicio de almacenamiento de archivos a utilizar. Los valores permitidos son s3 | none
     */
    STORAGE_SERVICE_TYPE: process.env.STORAGE_SERVICE_TYPE ?? 'none',
    /**
     * Tipo de servicio de envío de emails a utilizar. Los valores permitidos son mailjet | none
     */
    EMAIL_SERVICE_TYPE: process.env.EMAIL_SERVICE_TYPE ?? 'none',
    /**
     * Tipo de servicio de envío de notificationes push a utilizar. Los valores permitidos son fcm | none
     */
    PUSH_NOTIFICATIONS_SERVICE_TYPE: process.env.PUSH_NOTIFICATIONS_SERVICE_TYPE ?? 'none',
    /**
     * Tipo base de datos de autenticación a utilizar. Los valores permitidos son: mongodb
     */
    AUTHENTICATION_DATABASE_TYPE: process.env.AUTHENTICATION_DATABASE_TYPE ?? 'mongodb',
    /**
     * Url de conexión de mongoDB para la base de datos de autenticación
     */
    AUTHENTICATION_DATABASE_MONGODB_URL: process.env.AUTHENTICATION_DATABASE_MONGODB_URL ?? '',
    /**
     * Tipo base de datos para el envío de notificaciones push a dispositivos a utilizar. Los valores permitidos son: mongodb
     */
    PUSH_NOTIFICATION_DEVICES_DATABASE_TYPE: process.env.PUSH_NOTIFICATION_DEVICES_DATABASE_TYPE ?? 'mongodb',
    /**
     * Url de conexión de mongoDB para la base de datos de autenticación
     */
    PUSH_NOTIFICATION_DEVICES_DATABASE_MONGODB_URL: process.env.PUSH_NOTIFICATION_DEVICES_DATABASE_MONGODB_URL ?? '',
    /**
     * Tipo de base de datos para el manejo de la actividad de una cuenta a utilizar. Los valores permitidos son: mongodb
     */
    ACTIVITY_DATABASE_TYPE: process.env.ACTIVITY_DATABASE_TYPE ?? 'mongodb',
    /**
     * Url de conexión de mongoDB para la base de datos de actividad
     */
    ACTIVITY_DATABASE_MONGODB_URL: process.env.ACTIVITY_DATABASE_MONGODB_URL ?? '',
    /**
     * Tipo base de datos para la gestión social a utilizar. Los valores permitidos son: mongodb
     */
    SOCIAL_DATABASE_TYPE: process.env.SOCIAL_DATABASE_TYPE ?? 'mongodb',
    /**
     * Url de conexión de mongoDB para la base de datos social
     */
    SOCIAL_DATABASE_MONGODB_URL: process.env.SOCIAL_DATABASE_MONGODB_URL ?? '',
    /**
     * Habilita la autenticación mediante tokens JWT
     */
    JWT_AUTHENTICATION_ENABLED: stringToBoolean(process.env.JWT_AUTHENTICATION_ENABLED),
    /**
     * Secreto para firmar las sesiones de autenticación
     */
    AUTHENTICATION_SESSION_SECRET: process.env.AUTHENTICATION_SESSION_SECRET ?? '',
    /**
     * Secreto para firmar y validar los tokens JWT
     */
    JWT_SECRET: process.env.JWT_SECRET ?? '',
    /**
     * Tiempo de expiración en milisegundos del access token
     */
    JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS: stringToNumber(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS, 5 * 60 * 1000),
    /**
     * Tiempo de expiración en milisegundos del refresh token
     */
    JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS: stringToNumber(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS, 7 * 24 * 60 * 60 * 1000),
    /**
     * Habilita el inicio de sesión mediante email y contraseña
     */
    EMAIL_PASSWORD_AUTHENTICATION_ENABLED: stringToBoolean(process.env.EMAIL_PASSWORD_AUTHENTICATION_ENABLED),
    /**
     * Habilita el inicio de sesión mediante Google
     */
    GOOGLE_SIGN_IN_ENABLED: stringToBoolean(process.env.GOOGLE_SIGN_IN_ENABLED),
    /**
     * Client ID de Google para iniciar sesión
     */
    GOOGLE_PROVIDER_TOKEN_CLIENT_ID: process.env.GOOGLE_PROVIDER_TOKEN_CLIENT_ID ?? '',
    /**
     * Secreto de Google para iniciar sesión
     */
    GOOGLE_PROVIDER_TOKEN_CLIENT_SECRET: process.env.GOOGLE_PROVIDER_TOKEN_CLIENT_SECRET ?? '',
    /**
     * Url de redirección para la estrategia de inicio de sesión de Google para móviles
     */
    GOOGLE_PROVIDER_REDIRECTION_URL_MOBILE: process.env.GOOGLE_PROVIDER_REDIRECTION_URL_MOBILE ?? '',
    /**
     * Url de redirección para la estrategia de inicio de sesión de Google para web
     */
    GOOGLE_PROVIDER_REDIRECTION_URL_DESKTOP: process.env.GOOGLE_PROVIDER_REDIRECTION_URL_DESKTOP ?? '',
    /**
     * Habilita el inicio de sesión mediante Facebook
     */
    FACEBOOK_SIGN_IN_ENABLED: stringToBoolean(process.env.FACEBOOK_SIGN_IN_ENABLED),
    /**
     * Client ID de Facebook para iniciar sesión
     */
    FACEBOOK_PROVIDER_TOKEN_CLIENT_ID: process.env.FACEBOOK_PROVIDER_TOKEN_CLIENT_ID ?? '',
    /**
     * Secreto de Facebook para iniciar sesión
     */
    FACEBOOK_PROVIDER_TOKEN_CLIENT_SECRET: process.env.FACEBOOK_PROVIDER_TOKEN_CLIENT_SECRET ?? '',
    /**
     * Url de redirección para la estrategia de inicio de sesión de Facebook para móviles
     */
    FACEBOOK_PROVIDER_REDIRECTION_URL_MOBILE: process.env.FACEBOOK_PROVIDER_REDIRECTION_URL_MOBILE ?? '',
    /**
     * Url de redirección para la estrategia de inicio de sesión de Facebook para web
     */
    FACEBOOK_PROVIDER_REDIRECTION_URL_DESKTOP: process.env.FACEBOOK_PROVIDER_REDIRECTION_URL_DESKTOP ?? '',
    /**
     * Habilita el inicio de sesión mediante apple
     */
    APPLE_SIGN_IN_ENABLED: stringToBoolean(process.env.APPLE_SIGN_IN_ENABLED),
    /**
     * Client Id de Apple para iniciar sesión
     */
    APPLE_PROVIDER_TOKEN_CLIENT_ID: process.env.APPLE_PROVIDER_TOKEN_CLIENT_ID ?? '',
    /**
     * Key Id de Apple para iniciar sesión
     */
    APPLE_PROVIDER_TOKEN_KEY_ID: process.env.APPLE_PROVIDER_TOKEN_KEY_ID ?? '',
    /**
     * Ruta al archivo de clave privada para iniciar sesión en Apple. Debe situarse en la carpeta /certs
     */
    APPLE_PROVIDER_TOKEN_PRIVATE_KEY_FILE_NAME: process.env.APPLE_PROVIDER_TOKEN_PRIVATE_KEY_FILE_NAME ?? '',
    /**
     * Id del equipo de Apple para iniciar sesión
     */
    APPLE_PROVIDER_TOKEN_TEAM_ID: process.env.APPLE_PROVIDER_TOKEN_TEAM_ID ?? '',
    /**
     * Url de redirección para la estrategia de inicio de sesión de Apple para móviles
     */
    APPLE_PROVIDER_REDIRECTION_URL_MOBILE: process.env.APPLE_PROVIDER_REDIRECTION_URL_MOBILE ?? '',
    /**
     * Url de redirección para la estrategia de inicio de sesión de Apple para web
     */
    APPLE_PROVIDER_REDIRECTION_URL_DESKTOP: process.env.APPLE_PROVIDER_REDIRECTION_URL_DESKTOP ?? '',
    /**
     * Determina si el servidor de sockets está habilitado o no
     */
    SOCKET_ENABLED: stringToBoolean(process.env.SOCKET_ENABLED),
    /**
     * Namespace del servidor de sockets
     */
    SOCKET_NAMESPACE: process.env.SOCKET_NAMESPACE ?? 'client',
    /**
     * Orígenes desde los que se pueden escuchar los sockets. Es un string separado por comas y de esta manera se pueden poner múltiples orígenes permitidos.
     * Ej: http://localhost:3000,http://localhost:3001,http://localhost:3002
     */
    SOCKET_CORS_ORIGINS: stringToArray(process.env.SOCKET_CORS_ORIGINS),
    /**
     * Namespace del servidor de sockets para monitorización
     */
    SOCKET_MONITORIZATION_NAMESPACE: process.env.SOCKET_MONITORIZATION_NAMESPACE ?? 'monitorization',
    /**
     * Modo en el que la monitorización del servidor de sockets funcionará. Los valores permitidos son: development | production
     */
    SOCKET_MONITORIZATION_MODE: socketMonitorizationMode,
    /**
     * Nombre de usuario para acceder al administrador de monitorización de los sockets
     */
    SOCKET_MONITORIZATION_USERNAME: process.env.SOCKET_MONITORIZATION_USERNAME ?? '',
    /**
     * Contraseña de acceso al administrador de monitorización de los sockets
     */
    SOCKET_MONITORIZATION_PASSWORD: process.env.SOCKET_MONITORIZATION_PASSWORD ?? '',
    /**
     * Access key para utilizar S3
     */
    STORAGE_S3_ACCESS_KEY: process.env.STORAGE_S3_ACCESS_KEY ?? '',
    /**
     * Secret key para utilizar S3
     */
    STORAGE_S3_SECRET_KEY: process.env.STORAGE_S3_SECRET_KEY ?? '',
    /**
     * Nombre del bucket de S3
     */
    STORAGE_S3_BUCKET_NAME: process.env.STORAGE_S3_BUCKET_NAME ?? '',
    /**
     * Región del bucket de S3
     */
    STORAGE_S3_REGION: process.env.STORAGE_S3_REGION ?? '',
    /**
     * En caso de estar activado, no envía el email de manera real, pero sí que valida los campos introducidos
     */
    EMAIL_MAILJET_DRY_RUN: stringToBoolean(process.env.EMAIL_MAILJET_DRY_RUN),
    /**
     * Clave de mailjet
     */
    EMAIL_MAILJET_KEY: process.env.EMAIL_MAILJET_KEY ?? '',
    /**
     * Secreto de mailjet
     */
    EMAIL_MAILJET_SECRET: process.env.EMAIL_MAILJET_SECRET ?? '',
    /**
     * Determina si firebase está habilitado o no
     */
    FIREBASE_ENABLED: stringToBoolean(process.env.FIREBASE_ENABLED),
    /**
     * Nombre del archivo del service account de firebase
     */
    FIREBASE_SERVICE_ACCOUNT_FILENAME: process.env.FIREBASE_SERVICE_ACCOUNT_FILENAME ?? "",
    /**
     * Indica si se debe ignorar el uso real del servicio de notificaciones push de FCM
     */
    PUSH_NOTIFICATIONS_FCM_DRY_RUN: stringToBoolean(process.env.PUSH_NOTIFICATIONS_FCM_DRY_RUN),
    /**
     * Habilita el módulo de envío de notificaciones push a dispositivos
     */
    PUSH_NOTIFICATION_DEVICES_ENABLED: stringToBoolean(process.env.PUSH_NOTIFICATION_DEVICES_ENABLED),
    /**
     * Habilita el módulo de subida de archivos
     */
    ATTACHMENTS_MANAGEMENT_ENABLED: stringToBoolean(process.env.ATTACHMENTS_MANAGEMENT_ENABLED),
    /**
     * Habilita el módulo de manejo de un sistema de actividad
     */
    ACTIVITY_MANAGEMENT_ENABLED: stringToBoolean(process.env.ACTIVITY_MANAGEMENT_ENABLED),
    /**
     * Habilita el módulo social
     */
    SOCIAL_MANAGEMENT_ENABLED: stringToBoolean(process.env.SOCIAL_MANAGEMENT_ENABLED),
  };
})();
export type ENV = (typeof ENV)[keyof typeof ENV];
