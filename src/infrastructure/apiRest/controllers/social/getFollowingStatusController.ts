import { RequestHandler } from "express";
import { SocialService } from "../../../../application/social/social.service.js";
import { sendResponse } from "../../sendResponse.js";
import { ServerResponseCode, ServerResponseStatus } from "../../types.js";

interface GetFollowingStatusControllerParams {
  socialService: SocialService
}

export function getFollowingStatusController(params: GetFollowingStatusControllerParams): RequestHandler {
  return async (req, res) => {
    const {followerId, followedId} = req.params;

    const result = await params.socialService.getFollowingRelationshipStatus(followerId, followedId);

    if(result.isFailure){
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success);
  }
}