import { AccountType, SupportedAccounts } from "./types.js";
import { PersonalAccount, PersonalAccountInstance } from "./PersonalAccount/PersonalAccount.model.js";
import { BaseAccountInstance, BaseAccountValues } from "./BaseAccount.model.js";
import { PartialDeep } from "type-fest";
import { Result } from "../../../core/types/Result.js";
import { AdminAccount, AdminAccountInstance } from "./AdminAccount/AdminAccount.model.js";

function _creator(item: {type: BaseAccountValues["type"]}): Result<SupportedAccounts, undefined>{
  switch(item.type){
    case AccountType.PERSONAL:
      return Result.ok(new PersonalAccount(item as PersonalAccountInstance));
    case AccountType.ADMIN:
      return Result.ok(new AdminAccount(item as AdminAccountInstance));
    default:
      return Result.fail();
  }
}

export class AccountFactory {

  static toCreate(item: Partial<BaseAccountInstance> & BaseAccountValues): Result<SupportedAccounts, undefined>{
    return _creator(item);
  }

  static toUpdate(item: PartialDeep<BaseAccountInstance> & {type: BaseAccountValues["type"]}): Result<SupportedAccounts, undefined>{
    return _creator(item);
  }
}