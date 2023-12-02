import { SocialEvents } from "../../../domain/social/social.events.js";
import { getEventService } from "../../services/getEventService.js";
import { getLogger } from "../../services/getLogger.js";
import { onSocialFollowingRelationshipCreated } from "./onSocialFollowingRelationshipCreated.js";
import { onSocialFollowingRelationshipRemoved } from "./onSocialFollowingRelationshipRemoved.js";

const eventsService = getEventService();
const loggerService = getLogger();

export function registerSocialEvents() {
  eventsService.on(
    SocialEvents.SOCIAL_FOLLOWING_RELATIONSHIP_CREATED,
    onSocialFollowingRelationshipCreated({
      loggerService,
    })
  );

  eventsService.on(
    SocialEvents.SOCIAL_FOLLOWING_RELATIONSHIP_REMOVED,
    onSocialFollowingRelationshipRemoved({
      loggerService,
    })
  );

}