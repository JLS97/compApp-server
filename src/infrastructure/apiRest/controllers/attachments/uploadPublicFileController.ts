import { RequestHandler } from "express";
import { rm } from "fs/promises";
import { nanoid } from "nanoid";
import { ServerResponseCode, ServerResponseStatus } from "../../types.js";
import { sendResponse } from "../../sendResponse.js";
import { StorageService } from "../../../../domain/storage/StorageService.js";

interface UploadPublicFileControllerParams {
  storageService: StorageService;
}

export function uploadPublicFileController(params: UploadPublicFileControllerParams): RequestHandler {
  return async (req, res) => {
    const files = req.files?.filesToUpload ? Array.isArray(req.files.filesToUpload) ? req.files.filesToUpload : [req.files.filesToUpload] : [];

    try {
      const body = req.body ?? {}

      const formData = JSON.parse(body?.data ?? "{}")
      const formattedFiles = files.map(item => {
        return {
          data: item.data,
          mimetype: item.mimetype,
          name: item.name,
          sizeInBytes: item.size,
          tempFilePath: item.tempFilePath,
          encoding: item.encoding,
          md5: item.md5,
        }
      })

      /**
       * El nombre se genera en el servidor: con el nombre original, un usuario podría sobrescribir el archivo público de otro
       */
      const uploadResults = await params.storageService.uploadPublicImage(formattedFiles, {
        destFolder: "uploaded-files",
        destFileName: nanoid(),
        maxFiles: 1,
        maxFileSize: 50 * 1024 * 1024,
        minFileSize: 1,
        validMimeTypes: ["image/png", "image/jpeg"],
      });

      sendResponse(res, ServerResponseStatus.OK, ServerResponseCode.SUCCESS, {
        filesUploadResult: uploadResults,
        otherData: formData,
      });
    } finally {
      // express-fileupload no borra los temporales, así que hay que hacerlo tras cada subida
      await Promise.all(files.filter(item => item.tempFilePath).map(item => rm(item.tempFilePath, { force: true })));
    }
  };
}
