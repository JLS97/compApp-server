import { RequestHandler } from "express";
import { ActivityService } from "../../../../application/activity/activity.service.js";
import { sendResponse } from "../../sendResponse.js";
import { ServerResponseCode, ServerResponseStatus } from "../../types.js";

interface TotalUnreadActivityEventsController {
  activityService: ActivityService
}

export function totalUnreadActivityEventsController(params: TotalUnreadActivityEventsController): RequestHandler {
  return async (req, res) => {
    const selectedAccount = req.selectedAccount;

    const result = await params.activityService.getTotalUnread(selectedAccount.id);

    if (result.isFailure) {
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success)
  }
}