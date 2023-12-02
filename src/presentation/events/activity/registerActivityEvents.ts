import { ActivityEvents } from "../../../domain/activity/activity.events.js";
import { getEventService } from "../../services/getEventService.js";
import { getLogger } from "../../services/getLogger.js";
import { onActivityEventPublished } from "./onActivityEventPublished.js";
import { onActivityEventRead } from "./onActivityEventRead.js";
import { onActivityEventUnread } from "./onActivityEventUnread.js";
import { onActivityEventUpdated } from "./onActivityEventUpdated.js";

const eventsService = getEventService();
const loggerService = getLogger();

export function registerActivityEvents() {
  eventsService.on(
    ActivityEvents.ACTIVITY_EVENT_PUBLISHED,
    onActivityEventPublished({
      loggerService,
    })
  );

  eventsService.on(
    ActivityEvents.ACTIVITY_EVENT_READ,
    onActivityEventRead({
      loggerService,
    })
  );

  eventsService.on(
    ActivityEvents.ACTIVITY_EVENT_UNREAD,
    onActivityEventUnread({
      loggerService,
    })
  );

  eventsService.on(
    ActivityEvents.ACTIVITY_EVENT_UPDATED,
    onActivityEventUpdated({
      loggerService,
    })
  );
}