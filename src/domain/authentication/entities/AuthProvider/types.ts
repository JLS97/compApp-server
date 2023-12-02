import { AppleAuthProvider } from "./AppleAuthProvider/AppleAuthProvider.model.js";
import { EmailAuthProvider } from "./EmailAuthProvider/EmailAuthProvider.model.js";
import { FacebookAuthProvider } from "./FacebookAuthProvider/FacebookAuthProvider.model.js";
import { GoogleAuthProvider } from "./GoogleAuthProvider/GoogleAuthProvider.model.js";

export const AuthProviderType = {
  EMAIL: "EMAIL",
  GOOGLE: "GOOGLE",
  APPLE: "APPLE",
  FACEBOOK: "FACEBOOK",
} as const;
export type AuthProviderType = typeof AuthProviderType[keyof typeof AuthProviderType];

export type SupportedAuthProviders = EmailAuthProvider | AppleAuthProvider | GoogleAuthProvider | FacebookAuthProvider;