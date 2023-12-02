import {BaseAccountInstance, BaseAccountValues} from '../../domain/authentication/entities/Account/BaseAccount.model.js';
import {Result} from '../../domain/core/types/Result.js';
import {AuthenticationDatabase} from '../../domain/authentication/authentication.database.js';
import {EventsService} from '../../domain/events/EventsService.js';
import {BaseAuthProviderInstance, BaseAuthProviderValues} from '../../domain/authentication/entities/AuthProvider/BaseAuthProvider.model.js';
import {UpdateAccountError, updateAccount} from './service/updateAccount.js';
import {AddProviderToAccountError, addProviderToAccount} from './service/addProviderToAccount.js';
import {EmailAuthProviderInstance} from '../../domain/authentication/entities/AuthProvider/EmailAuthProvider/EmailAuthProvider.model.js';
import {hashPassword} from './service/hashPassword.js';
import {compareHashedPassword} from './service/compareHashedPassword.js';
import {LoginWithEmailAndPasswordError, loginWithEmailAndPassword} from './service/loginWithEmailAndPassword.js';
import {RequestPasswordResetEmailError, requestPasswordResetEmail} from './service/requestPasswordResetEmail.js';
import {ChangeEmailProviderPasswordError, changeEmailProviderPassword} from './service/changeEmailProviderPassword.js';
import {ChangeEmailProviderPasswordByCodeError, changeEmailProviderPasswordByCode} from './service/changeEmailProviderPasswordByCode.js';
import {ChangeEmailError, changeEmail} from './service/changeEmail.js';
import {GetAccountByIdError, getAccountById} from './service/getAccountById.js';
import {DeleteAccountError, deleteAccount} from './service/deleteAccount.js';
import {RemoveProviderFromAccountError, removeProviderFromAccount} from './service/removeProviderFromAccount.js';
import {GetAuthProviderByIdError, getAuthProviderById} from './service/getAuthProviderById.js';
import {GetAuthProviderByEmailError, getAuthProviderByEmail} from './service/getAuthProviderByEmail.js';
import {SignupWithEmailAndPasswordError, signupWithEmailAndPassword} from './service/signupWithEmailAndPassword.js';
import {AccessCredentials, AccessTokenEncoded} from '../../domain/authentication/types.js';
import {GenerateCredentialsError, GenerateCredentialsOptions, generateCredentials} from './service/generateCredentials.js';
import {RefreshTokenInstance} from '../../domain/authentication/entities/RefreshToken/RefreshToken.model.js';
import {GetRefreshTokenByIdError, getRefreshTokenById} from './service/getRefreshTokenById.js';
import {CreateRefreshTokenForAuthProviderIdError, createRefreshTokenForAuthProviderId} from './service/createRefreshTokenForAuthProviderId.js';
import {
  CreateAccessTokenFromRefreshTokenError,
  CreateAccessTokenFromRefreshTokenOptions,
  createAccessTokenFromRefreshToken,
} from './service/createAccessTokenFromRefreshToken.js';
import {GetAccountsByAuthProviderIdError, getAccountsByAuthProviderId} from './service/getAccountsByAuthProviderId.js';
import {CreateAuthProviderError, createAuthProvider} from './service/createAuthProvider.js';
import {GetAccountsByIdError, getAccountsById} from './service/getAccountsById.js';
import { FacebookAuthProviderInstance } from '../../domain/authentication/entities/AuthProvider/FacebookAuthProvider/FacebookAuthProvider.model.js';
import { GetFacebookAuthProviderByProfileIdError, getFacebookAuthProviderByProfileId } from './service/getFacebookAuthProviderByProfileId.js';
import { PartialDeep } from 'type-fest';
import { CreateAccountError, createAccount } from './service/createAccount.js';

interface AuthenticationServiceParams {
  authenticationDatabase: AuthenticationDatabase;
  events: EventsService;
}

export class AuthenticationService {
  private _authenticationDB: AuthenticationDatabase;
  private _events: EventsService;

  constructor(params: AuthenticationServiceParams) {
    this._authenticationDB = params.authenticationDatabase;
    this._events = params.events;
  }

  /**
   * Recupera una cuenta por su id
   * @param accountId Id de la cuenta a recuperar
   */
  async getAccountById(accountId: string): Promise<Result<BaseAccountInstance, GetAccountByIdError>> {
    return await getAccountById(this._authenticationDB, accountId);
  }

  /**
   * Recupera múltiples cuentas por sus ids
   * @param accountsId Ids de cuentas a recuperar
   */
  async getAccountsById(accountIds: string[]): Promise<Result<BaseAccountInstance[], GetAccountsByIdError>> {
    return await getAccountsById(this._authenticationDB, accountIds);
  }

  /**
   * Recupera las cuentas a las que tiene acceso un determinado proveedor de autenticación
   * @param authProviderId Id del proveedor de autenticación
   */
  async getAccountsByAuthProviderId(authProviderId: string): Promise<Result<BaseAccountInstance[], GetAccountsByAuthProviderIdError>> {
    return await getAccountsByAuthProviderId(this, this._authenticationDB, authProviderId);
  }

  /**
   * Crea una nueva cuenta
   * @param account Cuenta a crear
   */
  async createAccount<I extends BaseAccountInstance = BaseAccountInstance, V extends BaseAccountValues = BaseAccountValues>(account: Partial<I> & V): Promise<Result<BaseAccountInstance, CreateAccountError>> {
    return await createAccount(this._authenticationDB, this._events, account);
  }

  /**
   * Actualiza una cuenta
   * @param accountId Id de la cuenta a actualizar
   * @param accountValues Valores a actualizar de la cuenta. Aquellos valores indefinidos no se actualizarán
   * @returns
   */
  async updateAccount<V extends BaseAccountValues = BaseAccountValues>(accountId: string, accountValues: PartialDeep<V> & {type: V["type"]}): Promise<Result<BaseAccountInstance, UpdateAccountError>> {
    return await updateAccount(this._authenticationDB, this._events, accountId, accountValues);
  }

  /**
   * Elimina una cuenta por su id
   * @param accountId Id de la cuenta a eliminar
   */
  async deleteAccount(accountId: string): Promise<Result<BaseAccountInstance, DeleteAccountError>> {
    return await deleteAccount(this._authenticationDB, this._events, accountId);
  }

  /**
   * Añade un proveedor a una cuenta. Si se especifica el id del proveedor, se busca y se enlaza. Si no se especifica, se crea uno nuevo
   * @param accountId Id de la cuenta a la que enlazar el nuevo proveedor
   * @param provider Proveedor a enlazar
   */
  async addProviderToAccount(
    accountId: string,
    provider: Partial<BaseAuthProviderInstance> & BaseAuthProviderValues
  ): Promise<Result<BaseAccountInstance, AddProviderToAccountError>> {
    return await addProviderToAccount(this, this._authenticationDB, this._events, accountId, provider);
  }

  /**
   * Elimina un proveedor de una cuenta
   * @param accountId Id de la cuenta sobre la que desenlazar el proveedor
   * @param providerId Id del proveedor a desenlazar
   */
  async removeProviderFromAccount(accountId: string, providerId: string): Promise<Result<BaseAccountInstance, RemoveProviderFromAccountError>> {
    return await removeProviderFromAccount(this._authenticationDB, this._events, accountId, providerId);
  }

  /**
   * Encuentra un proveedor de autenticación a partir de su email
   * @param authProviderId Id del proveedor de autenticación
   */
  async getAuthProviderById(authProviderId: string): Promise<Result<BaseAuthProviderInstance, GetAuthProviderByIdError>> {
    return await getAuthProviderById(this._authenticationDB, authProviderId);
  }

  /**
   * Encuentra un proveedor de autenticación a partir de su email y su tipo
   * @param email Correo electrónico
   * @param type Tipo de proveedor
   */
  async getAuthProviderByEmail(email: string, type: string): Promise<Result<BaseAuthProviderInstance, GetAuthProviderByEmailError>> {
    return await getAuthProviderByEmail(this._authenticationDB, email, type);
  }

  /**
   * Encuentra un proveedor de facebook a partir del profileId
   * @param profileId Id de perfil de facebook
   */
  async getFacebookAuthProviderByProfileId(profileId: string): Promise<Result<FacebookAuthProviderInstance, GetFacebookAuthProviderByProfileIdError>> {
    return await getFacebookAuthProviderByProfileId(this._authenticationDB, profileId);
  }

  /**
   * Crea un nuevo proveedor de autenticación
   * @param authProvider Proveedor de autenticación a añadir
   */
  async createAuthProvider<I extends BaseAuthProviderInstance = BaseAuthProviderInstance, V extends BaseAuthProviderValues = BaseAuthProviderValues>(
    authProvider: Partial<I> & V
  ): Promise<Result<BaseAuthProviderInstance, CreateAuthProviderError>> {
    return await createAuthProvider(this._authenticationDB, this._events, authProvider);
  }

  /**
   * Inicia sesión mediante un email y una contraseña
   * @param email Email
   * @param password Contraseña
   */
  async loginWithEmailAndPassword(email: string, password: string): Promise<Result<EmailAuthProviderInstance, LoginWithEmailAndPasswordError>> {
    return await loginWithEmailAndPassword(this, email, password);
  }

  /**
   * Realiza un registro mediante email y contraseña
   * @param email Email
   * @param password Contraseña
   */
  async signupWithEmailAndPassword(email: string, password: string): Promise<Result<EmailAuthProviderInstance, SignupWithEmailAndPasswordError>> {
    return await signupWithEmailAndPassword(this, this._authenticationDB, this._events, email, password);
  }

  /**
   * Encripta una contraseña en texto plano
   * @param password Contraseña a encriptar
   */
  async hashPassword(password: string): Promise<string> {
    return await hashPassword(password);
  }

  /**
   * Compara una contraseña en texto plano con su contraparte encriptada
   * @param passwordCandidate Contraseña en texto plano
   * @param hashedPassword Contraseña encriptada
   * @returns true si las contraseñas coinciden
   */
  async compareHashedPassword(passwordCandidate: string, hashedPassword: string): Promise<boolean> {
    return await compareHashedPassword(passwordCandidate, hashedPassword);
  }

  /**
   * Solicita resetear la contraseña para un proveedor de email
   * @param email Email sobre el que resetear la contraseña
   */
  async requestPasswordResetEmail(email: string): Promise<Result<undefined, RequestPasswordResetEmailError>> {
    return await requestPasswordResetEmail(this, this._events, email);
  }

  /**
   * Cambia la contraseña de un proveedor de autenticación de email mediante un código
   * @param authProviderId Id del proveedor a actualizar
   * @param code Código
   * @param newPassword Nueva contraseña
   */
  async changeEmailProviderPasswordByCode(
    authProviderId: string,
    code: string,
    newPassword: string
  ): Promise<Result<EmailAuthProviderInstance, ChangeEmailProviderPasswordByCodeError>> {
    return await changeEmailProviderPasswordByCode(this, this._authenticationDB, this._events, authProviderId, code, newPassword);
  }

  /**
   * Cambia la contraseña de un proveedor de autenticación de email mediante la contraseña anterior
   * @param authProviderId Id del proveedor a actualizar
   * @param oldPassword Contraseña anterior
   * @param newPassword Nueva contraseña
   */
  async changeEmailProviderPassword(
    authProviderId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<Result<EmailAuthProviderInstance, ChangeEmailProviderPasswordError>> {
    return await changeEmailProviderPassword(this, this._authenticationDB, this._events, authProviderId, oldPassword, newPassword);
  }

  /**
   * Cambia el email de un proveedor de autenticación de email a otro nuevo
   * @param authProviderId Id del proveedor a actualizar
   * @param newEmail Nuevo email
   */
  async changeEmail(authProviderId: string, newEmail: string): Promise<Result<EmailAuthProviderInstance, ChangeEmailError>> {
    return await changeEmail(this, this._authenticationDB, this._events, authProviderId, newEmail);
  }

  /**
   * Genera unos credenciales de acceso para un auth provider
   * @param authProviderId Id del auth provider al que generar los credenciales
   * @param options Opciones de configuración
   * @param options.refreshTokenExpiresInMs Número de milisegundos tras los cuales el refresh token expira
   * @param options.accessTokenExpiresInMs Número de milisegundos tras los cuales el access token expira
   * @param options.accessTokenSecret Secreto para firmar el access token
   */
  async generateCredentials(authProviderId: string, options: GenerateCredentialsOptions): Promise<Result<AccessCredentials, GenerateCredentialsError>> {
    return await generateCredentials(this, authProviderId, options);
  }

  /**
   * Recupera un refresh token por su id
   * @param refreshTokenId Id del refresh token
   */
  async getRefreshTokenById(refreshTokenId: string): Promise<Result<RefreshTokenInstance, GetRefreshTokenByIdError>> {
    return await getRefreshTokenById(this._authenticationDB, refreshTokenId);
  }

  /**
   * Crea un refresh token para un proveedor de autenticación
   * @param authProviderId Id del proveedor de autenticación
   * @param expiresInMs Tiempo en milisegundos a partir del cual el token expira
   */
  async createRefreshTokenForAuthProviderId(
    authProviderId: string,
    expiresInMs: number
  ): Promise<Result<RefreshTokenInstance, CreateRefreshTokenForAuthProviderIdError>> {
    return await createRefreshTokenForAuthProviderId(this._authenticationDB, authProviderId, expiresInMs);
  }

  /**
   * Genera un access token a partir de un refresh token
   * @param refreshTokenId Id del refresh token
   * @param options Opciones de configuración
   * @param options.expiresInMs Milisegundos tras los cuales el access token expira
   * @param options.accessTokenSecret Secreto para firmar el access token
   */
  async createAccessTokenFromRefreshToken(
    refreshTokenId: string,
    options: CreateAccessTokenFromRefreshTokenOptions
  ): Promise<Result<AccessTokenEncoded, CreateAccessTokenFromRefreshTokenError>> {
    return await createAccessTokenFromRefreshToken(this, refreshTokenId, options);
  }
}
