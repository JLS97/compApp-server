import {Socket} from 'socket.io';
import {BaseAccountInstance} from '../../domain/authentication/entities/Account/BaseAccount.model.js';

export interface ExtendedSocket extends Socket {
  accountsId: string[];
  accounts: BaseAccountInstance[];
  authProviderId: string
}
