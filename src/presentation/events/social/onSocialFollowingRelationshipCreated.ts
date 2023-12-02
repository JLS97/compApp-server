import { LoggerService } from "../../../domain/logger/LoggerService.js";
import { SocialFollowingRelationshipCreatedEventPayload } from "../../../domain/social/social.events.js";

interface Params {
  loggerService: LoggerService
}

export function onSocialFollowingRelationshipCreated(params: Params) {
  return async (payload: SocialFollowingRelationshipCreatedEventPayload) => {
    params.loggerService.info(`[EVENT ${onSocialFollowingRelationshipCreated.name}]: ${payload.followerId} -> ${payload.followedId}`);
  }
}