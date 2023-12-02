import { AuthProviderType, SupportedAuthProviders } from "./types.js";
import { BaseAuthProviderInstance, BaseAuthProviderValues } from "./BaseAuthProvider.model.js";
import { PartialDeep } from "type-fest";
import { Result } from "../../../core/types/Result.js";
import { EmailAuthProvider, EmailAuthProviderInstance } from "./EmailAuthProvider/EmailAuthProvider.model.js";
import { GoogleAuthProvider, GoogleAuthProviderInstance } from "./GoogleAuthProvider/GoogleAuthProvider.model.js";
import { AppleAuthProvider, AppleAuthProviderInstance } from "./AppleAuthProvider/AppleAuthProvider.model.js";
import { FacebookAuthProvider, FacebookAuthProviderInstance } from "./FacebookAuthProvider/FacebookAuthProvider.model.js";

function _creator(item: {type: BaseAuthProviderValues["type"]}): Result<SupportedAuthProviders, undefined>{
  switch(item.type){
    case AuthProviderType.EMAIL:
      return Result.ok(new EmailAuthProvider(item as EmailAuthProviderInstance));
    case AuthProviderType.GOOGLE:
      return Result.ok(new GoogleAuthProvider(item as GoogleAuthProviderInstance));
    case AuthProviderType.APPLE:
      return Result.ok(new AppleAuthProvider(item as AppleAuthProviderInstance));
    case AuthProviderType.FACEBOOK:
      return Result.ok(new FacebookAuthProvider(item as FacebookAuthProviderInstance));
    default:
      return Result.fail();
  }
}

export class AuthProviderFactory {

  static toCreate(item: Partial<BaseAuthProviderInstance> & BaseAuthProviderValues): Result<SupportedAuthProviders, undefined>{
    return _creator(item);
  }

  static toUpdate(item: PartialDeep<BaseAuthProviderInstance> & {type: BaseAuthProviderValues["type"]}): Result<SupportedAuthProviders, undefined>{
    return _creator(item);
  }
}