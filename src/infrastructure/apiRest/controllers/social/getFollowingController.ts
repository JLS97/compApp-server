import { RequestHandler } from "express";
import { SocialService } from "../../../../application/social/social.service.js";
import { sendResponse } from "../../sendResponse.js";
import { ServerResponseCode, ServerResponseStatus } from "../../types.js";

interface GetFollowingControllerParams {
  socialService: SocialService
}

export function getFollowingController(params: GetFollowingControllerParams): RequestHandler {
  return async (req, res) => {
    const {page, pageSize, followerId} = req.params;

    const formattedPage = parseInt(page, 10);
    const formattedPageSize = parseInt(pageSize, 10);

    const result = await params.socialService.getPaginatedFollowingRelationshipByFollowerId(followerId, formattedPage, formattedPageSize);

    if(result.isFailure){
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success);
  }
}