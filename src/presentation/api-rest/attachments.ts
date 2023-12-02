import express from 'express';
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
  Middlewares.errorHandler(
    Controllers.attachments.uploadPublicFileController({
      storageService,
    }),
    loggerService
  )
);

export {apiRestAttachments}