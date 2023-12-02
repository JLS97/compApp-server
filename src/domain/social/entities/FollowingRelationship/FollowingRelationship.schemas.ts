import * as yup from 'yup';

export const FollowingRelationshipSchemas = {
  followerId: yup.string(),
  followedId: yup.string(),
}