import { LoggerService } from "../../../domain/logger/LoggerService.js";
import { ActivityEventReadEventPayload } from "../../../domain/activity/activity.events.js";

interface Params {
  loggerService: LoggerService
}

export function onActivityEventRead(params: Params) {
  return async (payload: ActivityEventReadEventPayload) => {
    params.loggerService.info(`[EVENT ${onActivityEventRead.name}]: ${payload.receiverId}`);
  }
}