import {IncomingMessage} from 'http';

export const ServerResponseCode = {
  // La petición se ha procesado con éxito
  SUCCESS: 'SUCCESS',
  // La petición es incorrecta y no se ha conseguido el objetivo que se pretendía
  BAD_REQUEST: 'BAD_REQUEST',
  // Quien hace la petición no tiene las credenciales necesarias para realizarla
  UNAUTHORIZED: 'UNAUTHORIZED',
  // Quien hace la petición tiene las credenciales, pero no el permiso suficiente para realizarla
  FORBIDDEN: 'FORBIDDEN',
  // No se ha encontrado la ruta buscada
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
  // La característica no está habilitada o no está implementada
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  // La petición ha fallado debido a un error interno del servidor
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;
export type ServerResponseCode = (typeof ServerResponseCode)[keyof typeof ServerResponseCode];

// Source: https://www.semrush.com/blog/http-status-codes
export const ServerResponseStatus = {
  /**
   * 200
   *
   * This is the standard response for successful HTTP requests. The actual meaning of the response depends on the request method used:
   *
   * - GET: Resource obtained and is in the message body
   *
   * - HEAD: Headers are included in the response
   *
   * - POST or PUT: Resource describing the result of the action sent is in the message body
   *
   * - TRACE: Message body contains the request message as received by the server
   */
  OK: 200,
  /**
   * 201
   *
   * The request succeeded and a new resource was created. This is usually the response after POST or PUT requests
   */
  CREATED: 201,
  /**
   * 301
   *
   * This redirect status code indicates the requested resource has permanently moved to a new URL. The browser displays the new URL
   */
  MOVED_PERMANENTLY: 301,
  /**
   * 302
   *
   * Previously known as “Moved Temporarily,” this code indicates the requested resource has temporarily moved to a new URL
   */
  FOUND: 302,
  /**
   * 304
   *
   * Used for caching purposes. The response hasn’t been modified, so the client can continue to use the same cached version of the requested resource
   */
  NOT_MODIFIED: 304,
  /**
   * 400
   *
   * The server can’t or won’t process the request due to a client error. For example, invalid request message framing, deceptive request routing, size too large, etc.
   */
  BAD_REQUEST: 400,
  /**
   * 401
   *
   * The user doesn’t have valid authentication credentials to get the requested resource
   */
  UNAUTHORIZED: 401,
  /**
   * 403
   *
   * The client doesn’t have access rights to the content. For example, it may require a password. Unlike the 401 HTTP error code, the server does know the client’s identity
   */
  FORBIDDEN: 403,
  /**
   * 404
   *
   * The server can’t find the requested resource, and no redirection has been set
   */
  NOT_FOUND: 404,
  /**
   * 410
   *
   * The content requested has been permanently deleted from the server and will not be reinstated
   */
  GONE: 410,
  /**
   * 413
   *
   * The client’s request is larger than the server’s defined limits, and the server refuses to process it.
   */
  PAYLOAD_TOO_LARGE: 413,
  /**
   * 414
   *
   * The URI (Uniform Resource Identifier) requested by the client is too long for the server to process
   */
  URI_TOO_LONG: 414,
  /**
   * 415
   *
   * The request uses a media format the server does not support
   */
  UNSUPPORTED_MEDIA_TYPE: 415,
  /**
   * 423
   *
   * The resource that is being accessed is locked.
   */
  LOCKED: 423,
  /**
   * 429
   *
   * The user sends too many requests in a certain amount of time
   */
  TOO_MANY_REQUESTS: 429,
  /**
   * 500
   *
   * The server has encountered an unexpected error and cannot complete the request
   */
  INTERNAL_SERVER_ERROR: 500,
  /**
   * 501
   *
   * The server can’t fulfill the request or doesn’t recognize the request method
   */
  NOT_IMPLEMENTED: 501,
  /**
   * 502
   *
   * The server acts as a gateway and gets an invalid response from an inbound host
   */
  BAD_GATEWAY: 502,
  /**
   * 503
   *
   * The server is unable to process the request. This often occurs when a server is overloaded or down for maintenance.
   */
  SERVICE_UNAVAILABLE: 503,
  /**
   * 504
   *
   * The server was acting as a gateway or proxy and timed out, waiting for a response
   */
  GATEWAY_TIMEOUT: 504,
};
export type ServerResponseStatus = (typeof ServerResponseStatus)[keyof typeof ServerResponseStatus];

export type IncomingMessageWithRawBody = IncomingMessage & {rawBody: string};
export type RequestWithRawBody = Request & {rawBody: string};
