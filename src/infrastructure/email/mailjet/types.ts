export interface MailjetSendEmailResponse {
  Messages: (MailjetSendEmailMessageSuccess | MailjetSendEmailMessageError)[];
}

export interface MailjetSendEmailMessageResponse {
  Status: string;
}

export interface MailjetSendEmailMessageSuccess extends MailjetSendEmailMessageResponse {
  Status: 'success';
  CustomID: string;
  To: MailjetSendEmailMessageSuccessAddress[];
  Cc: MailjetSendEmailMessageSuccessAddress[];
  Bcc: MailjetSendEmailMessageSuccessAddress[];
}

export interface MailjetSendEmailMessageSuccessAddress {
  Email: string;
  MessageUUID: string;
  MessageID: number;
  MessageHref: string;
}

export interface MailjetSendEmailMessageError {
  Status: 'error';
  Errors: MailjetSendEmailMessageErrorItem[];
}

export interface MailjetSendEmailMessageErrorItem {
  ErrorIdentifier: string;
  ErrorCode: string;
  StatusCode: number;
  ErrorMessage: string;
  ErrorRelatedTo: string[];
}
