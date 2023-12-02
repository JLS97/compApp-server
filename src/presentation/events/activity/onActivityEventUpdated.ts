import { LoggerService } from "../../../domain/logger/LoggerService.js";
import { ActivityEventUpdatedEventPayload } from "../../../domain/activity/activity.events.js";

interface Params {
  loggerService: LoggerService
}

export function onActivityEventUpdated(params: Params) {
  return async (payload: ActivityEventUpdatedEventPayload) => {
    params.loggerService.info(`[EVENT ${onActivityEventUpdated.name}]: ${payload.receiverId}`);
  }
}