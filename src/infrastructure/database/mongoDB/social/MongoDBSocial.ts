import { SocialDatabase } from "../../../../domain/social/social.database.js";
import { Result } from "../../../../domain/core/types/Result.js";
import { Operation } from "../../../../domain/operations/types.js";
import { FollowingRelationshipInstance, FollowingRelationshipValues } from "../../../../domain/social/entities/FollowingRelationship/FollowingRelationship.model.js";
import { Paginated } from "../../../../domain/core/types/Paginated.js";
import { MongoDBDatabase, MongoDBDatabaseParams } from "../MongoDBDatabase.js";
import { DBFollowingRelationshipInstance, DBFollowingRelationshipToItem, FollowingRelationshipInstanceToDBItem, dbFollowingRelationshipSchema } from "./followingRelationship/FollowingRelationshipDBModel.js";
import { Model } from "mongoose";
import { findOne } from "../core/operations/findOne.js";
import { findMany } from "../core/operations/findMany.js";
import { findPaginated } from "../core/operations/findPaginated.js";
import { removeOne } from "../core/operations/removeOne.js";
import { createOne } from "../core/operations/createOne.js";

export class MongoDBSocialDatabase extends MongoDBDatabase implements SocialDatabase {
  private followingRelationshipModel: Model<DBFollowingRelationshipInstance>

  constructor(params: MongoDBDatabaseParams){
    super(params);

    const connection = this.getConnection();

    connection.model("FollowingRelationship", dbFollowingRelationshipSchema);

    this.followingRelationshipModel = connection.model("FollowingRelationship")
  }

  // ------------------ //
  // FOLLOWING RELATIONSHIP
  // ------------------ //
  async findFollowingRelationship<T extends FollowingRelationshipInstance>(filters: Partial<Record<keyof T, Operation>>): Promise<Result<FollowingRelationshipInstance, undefined>> {
    return await findOne(this.followingRelationshipModel, DBFollowingRelationshipToItem)(filters);
  }

  async findFollowingRelationships<T extends FollowingRelationshipInstance>(filters: Partial<Record<keyof T, Operation>>): Promise<Result<FollowingRelationshipInstance[], undefined>> {
    return await findMany(this.followingRelationshipModel, DBFollowingRelationshipToItem)(filters);
  }

  async findFollowingRelationshipsPaginated<T extends FollowingRelationshipInstance>(filters: Partial<Record<keyof T, Operation>>, page: number, pageSize: number): Promise<Result<Paginated<FollowingRelationshipInstance>, undefined>> {
    return await findPaginated(this.followingRelationshipModel, DBFollowingRelationshipToItem)(filters, page, pageSize);
  }

  async addFollowingRelationship<T extends FollowingRelationshipInstance, K extends FollowingRelationshipValues>(instance: Partial<T> & K): Promise<Result<FollowingRelationshipInstance, undefined>> {
    return await createOne(this.followingRelationshipModel, FollowingRelationshipInstanceToDBItem, DBFollowingRelationshipToItem)(instance);
  }

  async removeFollowingRelationship<T extends FollowingRelationshipInstance>(criteria: Partial<Record<keyof T, Operation>>): Promise<Result<FollowingRelationshipInstance, undefined>> {
    return await removeOne(this.followingRelationshipModel, DBFollowingRelationshipToItem)(criteria);
  }
}
