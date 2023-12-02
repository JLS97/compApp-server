export const FollowingStatus = {
  FOLLOWING: 'FOLLOWING',
  NOT_FOLLOWING: 'NOT_FOLLOWING',
} as const;
export type FollowingStatus = (typeof FollowingStatus)[keyof typeof FollowingStatus];