import { RequestHandler } from "express";
import { SocialService } from "../../../../application/social/social.service.js";
import { sendResponse } from "../../sendResponse.js";
import { ServerResponseCode, ServerResponseStatus } from "../../types.js";

interface UnfollowControllerParams {
  socialService: SocialService
}

export function unfollowController(params: UnfollowControllerParams): RequestHandler {
  return async (req, res) => {
    const selectedAccount = req.selectedAccount;
    const {unfollowedId} = req.params;

    const result = await params.socialService.deleteFollowingRelationship(selectedAccount.id, unfollowedId);

    if(result.isFailure){
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success);
  }
}