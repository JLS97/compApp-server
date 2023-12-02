import { LoggerService } from "../../../domain/logger/LoggerService.js";
import { ActivityEventPublishedEventPayload } from "../../../domain/activity/activity.events.js";

interface Params {
  loggerService: LoggerService
}

export function onActivityEventPublished(params: Params) {
  return async (payload: ActivityEventPublishedEventPayload) => {
    params.loggerService.info(`[EVENT ${onActivityEventPublished.name}]: ${payload.receiverId}`);
  }
}