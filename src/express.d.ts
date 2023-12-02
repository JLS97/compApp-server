import {BaseAccountInstance} from './domain/authentication/entities/Account/BaseAccount.model.ts';
import {AuthenticatedUser} from './domain/authentication/types.ts';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
    selectedAccount?: BaseAccountInstance;
  }
}
