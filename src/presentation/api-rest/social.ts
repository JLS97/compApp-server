import express from 'express';
import {getLogger} from '../services/getLogger.js';
import {getEventService} from '../services/getEventService.js';
import {SocialService} from '../../application/social/social.service.js';
import {Controllers, Middlewares} from '../../infrastructure/apiRest/index.js';
import {ENV} from '../../env.js';
import {getSocialDatabase} from '../services/getSocialDatabase.js';

const apiRestSocial = express.Router();

const loggerService = getLogger();
const eventsService = getEventService();

const socialDatabase = getSocialDatabase();

const socialService = new SocialService({
  eventsService,
  socialDatabase,
});

/**
 * Crea una relación de seguimiento con otro usuario
 */
apiRestSocial.post(
  '/follow/:followedId',
  Middlewares.isFeaturedEnabled(ENV.SOCIAL_MANAGEMENT_ENABLED),
  Middlewares.authorization.requireAccountInfo("accountId"),
  Middlewares.errorHandler(
    Controllers.social.followController({
      socialService,
    }),
    loggerService
  )
);

/**
 * Elimina una relación de seguimiento con otro usuario
 */
apiRestSocial.post(
  '/unfollow/:unfollowedId',
  Middlewares.isFeaturedEnabled(ENV.SOCIAL_MANAGEMENT_ENABLED),
  Middlewares.authorization.requireAccountInfo("accountId"),
  Middlewares.errorHandler(
    Controllers.social.unfollowController({
      socialService,
    }),
    loggerService
  )
);

/**
 * Recupera la lista paginada de seguidores de un usuario
 */
apiRestSocial.get(
  '/:accountId/followers/:followedId/:page/:pageSize',
  Middlewares.isFeaturedEnabled(ENV.SOCIAL_MANAGEMENT_ENABLED),
  Middlewares.authorization.requireAccountInfo("accountId", true),
  Middlewares.errorHandler(
    Controllers.social.getFollowersController({
      socialService,
    }),
    loggerService
  )
);

/**
 * Recupera la lista paginada de seguidos de un usuario
 */
apiRestSocial.get(
  '/:accountId/following/:followerId/:page/:pageSize',
  Middlewares.isFeaturedEnabled(ENV.SOCIAL_MANAGEMENT_ENABLED),
  Middlewares.authorization.requireAccountInfo("accountId", true),
  Middlewares.errorHandler(
    Controllers.social.getFollowingController({
      socialService,
    }),
    loggerService
  )
);

/**
 * Recupera el estado de seguimiento entre dos usuarios
 */
apiRestSocial.get(
  '/:accountId/following/status/:followerId/:followedId',
  Middlewares.isFeaturedEnabled(ENV.SOCIAL_MANAGEMENT_ENABLED),
  Middlewares.authorization.requireAccountInfo("accountId", true),
  Middlewares.errorHandler(
    Controllers.social.getFollowingStatusController({
      socialService,
    }),
    loggerService
  )
);

export {apiRestSocial};
