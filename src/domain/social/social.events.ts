import { FollowingRelationshipInstance } from "./entities/FollowingRelationship/FollowingRelationship.model.js";

export const SocialEvents = {
  SOCIAL_FOLLOWING_RELATIONSHIP_CREATED: "SOCIAL_FOLLOWING_RELATIONSHIP_CREATED",
  SOCIAL_FOLLOWING_RELATIONSHIP_REMOVED: "SOCIAL_FOLLOWING_RELATIONSHIP_REMOVED",
} as const;

export type SocialFollowingRelationshipCreatedEventPayload = FollowingRelationshipInstance;
export type SocialFollowingRelationshipRemovedEventPayload = FollowingRelationshipInstance;