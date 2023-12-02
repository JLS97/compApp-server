import { Paginated } from "../../domain/core/types/Paginated.js";
import { Result } from "../../domain/core/types/Result.js";
import { EventsService } from "../../domain/events/EventsService.js";
import { ActivityDatabase } from "../../domain/activity/activity.database.js";
import { GetPaginatedActivityEventsError, getPaginatedActivityEvents } from "./service/getPaginatedActivityEvents.js";
import { GetTotalUnreadError, getTotalUnread } from "./service/getTotalUnread.js";
import { MarkAsReadError, markAsRead } from "./service/markAsRead.js";
import { MarkAsUnreadError, markAsUnread } from "./service/markAsUnread.js";
import { PublishActivityEventError, publishActivityEvent } from "./service/publishActivityEvent.js";
import { UpdateActivityEventError, updateActivityEvent } from "./service/updateActivityEvent.js";
import { ActivityEventInstance, ActivityEventValues } from "../../domain/activity/entities/ActivityEvent/ActivityEvent.model.js";

interface ActivityServiceParams {
  activityDatabase: ActivityDatabase;
  events: EventsService;
}

export class ActivityService {
  private _activityDB: ActivityDatabase;
  private _events: EventsService;

  constructor(params: ActivityServiceParams){
    this._activityDB = params.activityDatabase;
    this._events = params.events;
  }

  async updateActivityEvent(activityEventId: string, activityEventValues: Partial<ActivityEventValues>): Promise<Result<ActivityEventInstance, UpdateActivityEventError>>{
    return await updateActivityEvent(this._activityDB, this._events, activityEventId, activityEventValues)
  }

  async publishActivityEvent(activityEventValue: ActivityEventValues): Promise<Result<ActivityEventInstance, PublishActivityEventError>> {
    return await publishActivityEvent(this._activityDB, this._events, activityEventValue);
  }

  async getPaginatedActivityEvents(
    receiverId: string,
    page: number,
    pageSize: number
  ): Promise<Result<Paginated<ActivityEventInstance>, GetPaginatedActivityEventsError>> {
    return await getPaginatedActivityEvents(this._activityDB, receiverId, page, pageSize);
  }

  async markAsRead(receiverId: string, activityEventIds: string[]): Promise<Result<ActivityEventInstance[], MarkAsReadError>> {
    return await markAsRead(this._activityDB, this._events, receiverId, activityEventIds);
  }

  async markAsUnread(receiverId: string, activityEventIds: string[]): Promise<Result<ActivityEventInstance[], MarkAsUnreadError>> {
    return await markAsUnread(this._activityDB, this._events, receiverId, activityEventIds);
  }

  async getTotalUnread(receiverId: string): Promise<Result<number, GetTotalUnreadError>> {
    return await getTotalUnread(this._activityDB, receiverId);
  }
}