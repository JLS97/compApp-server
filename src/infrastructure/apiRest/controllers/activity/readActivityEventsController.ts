import { RequestHandler } from "express";
import { ActivityService } from "../../../../application/activity/activity.service.js";
import { sendResponse } from "../../sendResponse.js";
import { ServerResponseCode, ServerResponseStatus } from "../../types.js";

interface ReadActivityEventsControllerParams {
  activityService: ActivityService
}

export function readActivityEventsController(params: ReadActivityEventsControllerParams): RequestHandler {
  return async (req, res) => {
    const selectedAccount = req.selectedAccount;

    const {activityEventIds} = req.body;

    const result = await params.activityService.markAsRead(selectedAccount.id, activityEventIds);

    if (result.isFailure) {
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success)
  }
}