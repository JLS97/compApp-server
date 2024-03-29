import { AdminAccount } from "./AdminAccount/AdminAccount.model.js";
import { PersonalAccount } from "./PersonalAccount/PersonalAccount.model.js";

export const AccountType = {
  PERSONAL: "PERSONAL",
  ADMIN: "ADMIN",
} as const;
export type AccountType = typeof AccountType[keyof typeof AccountType];

export type SupportedAccounts = PersonalAccount | AdminAccount;