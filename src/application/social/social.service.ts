import { Paginated } from "../../domain/core/types/Paginated.js";
import { Result } from "../../domain/core/types/Result.js";
import { EventsService } from "../../domain/events/EventsService.js";
import { FollowingRelationshipInstance } from "../../domain/social/entities/FollowingRelationship/FollowingRelationship.model.js";
import { SocialDatabase } from "../../domain/social/social.database.js";
import { FollowingStatus } from "../../domain/social/types.js";
import { CreateFollowingRelationshipError, createFollowingRelationship } from "./service/createFollowingRelationship.js";
import { DeleteFollowingRelationshipError, deleteFollowingRelationship } from "./service/deleteFollowingRelationship.js";
import { GetFollowingRelationshipStatusError, getFollowingRelationshipStatus } from "./service/getFollowingRelationshipStatus.js";
import { GetPaginatedFollowingRelationshipByFollowedIdError, getPaginatedFollowingRelationshipByFollowedId } from "./service/getPaginatedFollowingRelationshipByFollowedId.js";
import { GetPaginatedFollowingRelationshipByFollowerIdError, getPaginatedFollowingRelationshipByFollowerId } from "./service/getPaginatedFollowingRelationshipByFollowerId.js";

interface SocialServiceParams {
  socialDatabase: SocialDatabase
  eventsService: EventsService
}

export class SocialService {
  private _socialDatabase: SocialDatabase
  private _eventsService: EventsService

  constructor(params: SocialServiceParams) {
    this._socialDatabase = params.socialDatabase;
    this._eventsService = params.eventsService;
  }

  /**
   * Devuelve de manera paginada las relaciones de seguimientos en las que un usuario sigue a muchos otros
   */
  async getPaginatedFollowingRelationshipByFollowerId(followerId: string, page: number, pageSize: number): Promise<Result<Paginated<FollowingRelationshipInstance>, GetPaginatedFollowingRelationshipByFollowerIdError>>{
    return await getPaginatedFollowingRelationshipByFollowerId(this._socialDatabase, followerId, page, pageSize);
  }

  /**
   * Devuelve de manera paginada las relaciones de seguimiento en las que un usuario es seguido por muchos otros
   */
  async getPaginatedFollowingRelationshipByFollowedId(followedId: string, page: number, pageSize: number): Promise<Result<Paginated<FollowingRelationshipInstance>, GetPaginatedFollowingRelationshipByFollowedIdError>>{
    return await getPaginatedFollowingRelationshipByFollowedId(this._socialDatabase, followedId, page, pageSize);
  }

  /**
   * Devuelve el tipo de relación de seguimiento que existe entre dos usuarios
   */
  async getFollowingRelationshipStatus(followerId: string, followedId: string): Promise<Result<FollowingStatus, GetFollowingRelationshipStatusError>>{
    return await getFollowingRelationshipStatus(this._socialDatabase, followerId, followedId);
  }

  /**
   * Crea una relación de seguimiento entre dos usuarios
   */
  async createFollowingRelationship(followerId: string, followedId: string): Promise<Result<FollowingRelationshipInstance, CreateFollowingRelationshipError>>{
    return await createFollowingRelationship(this._socialDatabase, this._eventsService, followerId, followedId);
  }

  /**
   * Elimina una relación de seguimiento entre dos usuarios
   */
  async deleteFollowingRelationship(followerId: string, followedId: string): Promise<Result<FollowingRelationshipInstance, DeleteFollowingRelationshipError>>{
    return await deleteFollowingRelationship(this._socialDatabase, this._eventsService, followerId, followedId);
  }
}