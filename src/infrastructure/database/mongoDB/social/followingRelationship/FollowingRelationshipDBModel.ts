import { Document, Schema } from "mongoose";
import { FollowingRelationship, FollowingRelationshipInstance, FollowingRelationshipValues } from "../../../../../domain/social/entities/FollowingRelationship/FollowingRelationship.model.js";

export interface DBFollowingRelationshipValue {
  followerId: string
  followedId: string
}

export interface DBFollowingRelationshipInstance extends DBFollowingRelationshipValue {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const dbFollowingRelationshipSchema = new Schema<DBFollowingRelationshipInstance>({
  id: {type: String, required: true, unique: true},
  followerId: {type: String, required: true},
  followedId: {type: String, required: true},
}, {
  collection: "social_followingRelationships",
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
});

export function DBFollowingRelationshipToItem(dbItem: DBFollowingRelationshipValue & Document): FollowingRelationship {
  return new FollowingRelationship({
    ...dbItem.toJSON(),
  });
}

export function FollowingRelationshipValueToDBItem(item: FollowingRelationshipValues): DBFollowingRelationshipValue {
  const candidate = new FollowingRelationship(item);
  return {
    ...candidate.values(),
  }
}

export function FollowingRelationshipInstanceToDBItem(item: FollowingRelationshipInstance): DBFollowingRelationshipInstance {
  const candidate = new FollowingRelationship(item);

  return {
    ...candidate.instanceValues(),
  }
}