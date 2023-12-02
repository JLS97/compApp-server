export interface Email {
  messages: EmailMessage[];
  dryRun?: boolean;
}

export interface EmailAddressInfo {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  contentType: string;
  fileName: string;
  base64Content: string;
  contentId?: string;
}

export interface EmailMessage {
  from: EmailAddressInfo;
  to: EmailAddressInfo[];
  cc?: EmailAddressInfo[];
  bcc?: EmailAddressInfo[];
  subject: string;
  attachments?: EmailAttachment[];
  variables?: Record<string, string>;
  headers?: Record<string, string>;
  customId?: string;
  eventPayload?: string;
  customCampaign?: string;
  deduplicateCampaign?: boolean;
  urlTags?: string;
}

export interface RawEmailMessage extends EmailMessage {
  text: string;
  html: string;
}

export interface TemplateEmailMessage extends EmailMessage {
  templateId: string;
  templateLanguage?: boolean;
}

export interface SendEmailResponse {
  emailProviderRawResponse: string;
  messages: (SendEmailMessageSuccess | SendEmailMessageError)[];
}

export interface SendEmailMessageSuccess {
  id: string;
  to: SendEmailMessageSuccessAddress[];
  cc?: SendEmailMessageSuccessAddress[];
  bcc?: SendEmailMessageSuccessAddress[];
}

export interface SendEmailMessageSuccessAddress {
  email: string;
  emailProviderMessageId: string;
}

export interface SendEmailMessageError {
  errorId: string;
  errorCode: string;
  errorMessage: string;
}
