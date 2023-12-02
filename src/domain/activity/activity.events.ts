import { ActivityEventInstance } from "./entities/ActivityEvent/ActivityEvent.model.js";

export const ActivityEvents = {
  ACTIVITY_EVENT_UPDATED: "ACTIVITY_EVENT_UPDATED",
  ACTIVITY_EVENT_PUBLISHED: "ACTIVITY_EVENT_PUBLISHED",
  ACTIVITY_EVENT_READ: "ACTIVITY_EVENT_READ",
  ACTIVITY_EVENT_UNREAD: "ACTIVITY_EVENT_UNREAD",
} as const;


export type ActivityEventUpdatedEventPayload = ActivityEventInstance;

export type ActivityEventPublishedEventPayload = ActivityEventInstance;

export type ActivityEventReadEventPayload = ActivityEventInstance;

export type ActivityEventUnreadEventPayload = ActivityEventInstance;