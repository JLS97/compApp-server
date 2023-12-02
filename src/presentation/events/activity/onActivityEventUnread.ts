import { LoggerService } from "../../../domain/logger/LoggerService.js";
import { ActivityEventUnreadEventPayload } from "../../../domain/activity/activity.events.js";

interface Params {
  loggerService: LoggerService
}

export function onActivityEventUnread(params: Params) {
  return async (payload: ActivityEventUnreadEventPayload) => {
    params.loggerService.info(`[EVENT ${onActivityEventUnread.name}]: ${payload.receiverId}`);
  }
}