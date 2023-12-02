import { PersonalAccount } from "./PersonalAccount/PersonalAccount.model.js";

export const AccountType = {
  PERSONAL: "PERSONAL",
} as const;
export type AccountType = typeof AccountType[keyof typeof AccountType];

export type SupportedAccounts = PersonalAccount;