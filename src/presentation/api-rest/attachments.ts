import express from 'express';
import fileUpload from 'express-fileupload';
import { tmpdir } from 'os';
import { Controllers, Middlewares } from '../../infrastructure/apiRest/index.js';
import { getLogger } from '../services/getLogger.js';
import { getStorageService } from '../services/getStorageService.js';
import { ENV } from '../../env.js';

const apiRestAttachments = express.Router();

const loggerService = getLogger();
const storageService = getStorageService();

/**
 * Permite la subida de archivos públicos
 */
apiRestAttachments.post(
  '/public',
  Middlewares.isFeaturedEnabled(ENV.ATTACHMENTS_MANAGEMENT_ENABLED),
  Middlewares.authorization.requireAccessToken({ loggerService }),
  /**
   * Los archivos se procesan después de comprobar el access token. Si se procesasen de forma global, cualquiera podría llenar el disco de temporales
   */
  fileUpload({
    useTempFiles: true,
    debug: false,
    tempFileDir: tmpdir(),
    uploadTimeout: 30 * 1000,
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
    safeFileNames: true,
  }),
  Middlewares.errorHandler(
    Controllers.attachments.uploadPublicFileController({
      storageService,
    }),
    loggerService
  )
);

export {apiRestAttachments}