import { RequestHandler } from "express";
import { SocialService } from "../../../../application/social/social.service.js";
import { sendResponse } from "../../sendResponse.js";
import { ServerResponseCode, ServerResponseStatus } from "../../types.js";

interface FollowControllerParams {
  socialService: SocialService
}

export function followController(params: FollowControllerParams): RequestHandler {
  return async (req, res) => {
    const selectedAccount = req.selectedAccount;
    const {followedId} = req.params;

    const result = await params.socialService.createFollowingRelationship(selectedAccount.id, followedId);

    if(result.isFailure){
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success);
  }
}