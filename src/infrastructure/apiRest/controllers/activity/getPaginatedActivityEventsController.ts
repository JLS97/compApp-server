import { RequestHandler } from "express";
import { ActivityService } from "../../../../application/activity/activity.service.js";
import { sendResponse } from "../../sendResponse.js";
import { ServerResponseCode, ServerResponseStatus } from "../../types.js";

interface GetPaginatedActivityEventsControllerParams {
  activityService: ActivityService
}

export function getPaginatedActivityEventsController(params: GetPaginatedActivityEventsControllerParams): RequestHandler {
  return async (req, res) => {
    const selectedAccount = req.selectedAccount;

    const {page, pageSize} = req.params;

    const formattedPage = parseInt(page, 10);
    const formattedPageSize = parseInt(pageSize, 10);

    const result = await params.activityService.getPaginatedActivityEvents(selectedAccount.id, formattedPage, formattedPageSize);

    if (result.isFailure) {
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success)
  }
}