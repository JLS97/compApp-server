import { LoggerService } from "../../../domain/logger/LoggerService.js";
import { SocialFollowingRelationshipRemovedEventPayload } from "../../../domain/social/social.events.js";

interface Params {
  loggerService: LoggerService
}

export function onSocialFollowingRelationshipRemoved(params: Params) {
  return async (payload: SocialFollowingRelationshipRemovedEventPayload) => {
    params.loggerService.info(`[EVENT ${onSocialFollowingRelationshipRemoved.name}]: ${payload.followerId} -> ${payload.followedId}`);
  }
}