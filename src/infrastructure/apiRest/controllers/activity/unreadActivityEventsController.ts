import { RequestHandler } from "express";
import { ActivityService } from "../../../../application/activity/activity.service.js";
import { sendResponse } from "../../sendResponse.js";
import { ServerResponseCode, ServerResponseStatus } from "../../types.js";

interface UnreadActivityEventsControllerParams {
  activityService: ActivityService
}

export function unreadActivityEventsController(params: UnreadActivityEventsControllerParams): RequestHandler {
  return async (req, res) => {
    const selectedAccount = req.selectedAccount;

    const {activityEventIds} = req.body;

    const result = await params.activityService.markAsUnread(selectedAccount.id, activityEventIds);

    if (result.isFailure) {
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success)
  }
}