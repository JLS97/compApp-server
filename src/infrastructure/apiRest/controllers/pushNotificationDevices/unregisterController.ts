import { RequestHandler } from "express";
import { PushNotificationDevicesService } from "../../../../application/pushNotificationDevices/pushNotificationDevices.service.js";
import { sendResponse } from "../../sendResponse.js";
import { ServerResponseCode, ServerResponseStatus } from "../../types.js";

interface UnregisterControllerParams {
  pushNotificationDevicesService: PushNotificationDevicesService
}

export function unregisterController(params: UnregisterControllerParams): RequestHandler{
  return async (req, res) => {
    const selectedAccount = req.selectedAccount;
    const {token} = req.body;

    const result = await params.pushNotificationDevicesService.unregisterDevice(selectedAccount.id, token);

    if (result.isFailure) {
      sendResponse(res, ServerResponseStatus.BAD_REQUEST, ServerResponseCode.BAD_REQUEST, result.failure);
      return;
    }

    sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, result.success);
  }
}