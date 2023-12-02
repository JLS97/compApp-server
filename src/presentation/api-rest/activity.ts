import express from 'express'
import { ActivityService } from '../../application/activity/activity.service.js';
import { getLogger } from '../services/getLogger.js';
import { getEventService } from '../services/getEventService.js';
import { requireAccountInfo } from '../../infrastructure/apiRest/middlewares/authorization/requireAccountInfo.js';
import { errorHandler } from '../../infrastructure/apiRest/middlewares/errorHandler.js';
import { Controllers, Middlewares } from '../../infrastructure/apiRest/index.js';
import { ENV } from '../../env.js';
import { getActivityDatabase } from '../services/getActivityDatabase.js';

const apiRestActivity = express.Router();

const loggerService = getLogger();
const eventsService = getEventService();
const activityDatabase = getActivityDatabase();

const activityService = new ActivityService({
  activityDatabase: activityDatabase,
  events: eventsService,
});

/**
 * Marca una serie de ids de eventos de actividad como leídas
 */
apiRestActivity.put("/read", Middlewares.isFeaturedEnabled(ENV.ACTIVITY_MANAGEMENT_ENABLED), requireAccountInfo("accountId"), errorHandler(Controllers.activity.readActivityEventsController({
  activityService: activityService,
}), loggerService));

/**
 * Marca una serie de ids de eventos de actividad como no leídas
 */
apiRestActivity.put("/unread", Middlewares.isFeaturedEnabled(ENV.ACTIVITY_MANAGEMENT_ENABLED), requireAccountInfo("accountId"), errorHandler(Controllers.activity.unreadActivityEventsController({
  activityService: activityService,
}), loggerService));

/**
 * Recupera cuántos eventos de actividad hay sin leer
 */
apiRestActivity.get("/:accountId/unread/total", Middlewares.isFeaturedEnabled(ENV.ACTIVITY_MANAGEMENT_ENABLED), requireAccountInfo("accountId", true), errorHandler(Controllers.activity.totalUnreadActivityEventsController({
  activityService: activityService,
}), loggerService));

/**
 * Recupera un listado de eventos de actividad de manera paginada
 */
apiRestActivity.get("/:accountId/:page/:pageSize", Middlewares.isFeaturedEnabled(ENV.ACTIVITY_MANAGEMENT_ENABLED), requireAccountInfo("accountId", true), errorHandler(Controllers.activity.getPaginatedActivityEventsController({
  activityService: activityService,
}), loggerService));

export {apiRestActivity}