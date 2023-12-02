export interface BasePreparedPushNotification {
  data?: string,
  title?: string,
  subtitle?: string,
  body?: string,
  imageUrl?: string
  iconUrl?: string
  analyticsLabel?: string
  channelId?: string
  groupingKey?: string
  headers?: Record<string, string>
  notificationPriority?: "normal" | "high",
  notificationMessagePriority?: "min" | "low" | "default" | "high" | "max",
  webUrlToOpen?: string,
  absoluteTimeEvent?: Date
  visibility?: "public" | "private" | "secret"
  localOnly?: boolean
  language?: string
}

export interface MulticastPreparedPushNotification extends BasePreparedPushNotification {
  tokens: string[],
}

export interface SendPushNotificationResponse {
  successes: string[],
  failures: SendPushNotificationFailureResponse[],
}

export interface SendPushNotificationFailureResponse {
  code: string,
  message: string,
  stack: string
}