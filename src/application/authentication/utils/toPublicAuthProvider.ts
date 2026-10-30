import {BaseAuthProviderInstance} from '../../../domain/authentication/entities/AuthProvider/BaseAuthProvider.model.js';
import {EmailAuthProviderValues} from '../../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.model.js';

type PrivateAuthProviderFields = Partial<Pick<EmailAuthProviderValues, 'password' | 'resetPasswordCode' | 'resetPasswordCodeExpiresAt'>>;

/**
 * Devuelve una copia del proveedor de autenticación sin los campos que nunca deben salir del servidor (hash de la contraseña y código de reseteo).
 * Hay que utilizarla siempre que se envíe un proveedor a un cliente, ya sea por la api rest o por sockets
 * @param authProvider Proveedor de autenticación a enviar
 */
export function toPublicAuthProvider<T extends BaseAuthProviderInstance>(authProvider: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars --- Se extraen para descartarlos
  const {password, resetPasswordCode, resetPasswordCodeExpiresAt, ...publicAuthProvider} = authProvider as T & PrivateAuthProviderFields;

  return publicAuthProvider;
}
