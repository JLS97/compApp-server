import {SendEmailMessageError, SendEmailMessageSuccess, SendEmailResponse} from '../../../domain/email/types.js';
import {MailjetSendEmailMessageError, MailjetSendEmailMessageSuccess, MailjetSendEmailResponse} from './types.js';

export function formatEmailResponse(response: MailjetSendEmailResponse): SendEmailResponse {
  const formattedMessages = response.Messages.map((item) => {
    if (item.Status === 'error') {
      return formatEmailMessageError(item);
    }

    return formatEmailMessageSuccess(item);
  });

  return {
    emailProviderRawResponse: JSON.stringify(response),
    messages: formattedMessages,
  };
}

function formatEmailMessageError(item: MailjetSendEmailMessageError): SendEmailMessageError {
  return {
    errorId: item.Errors.map((item) => item.ErrorIdentifier).join(', '),
    errorCode: item.Errors.map((item) => item.ErrorCode).join(', '),
    errorMessage: item.Errors.map((item) => item.ErrorMessage).join('. '),
  };
}

function formatEmailMessageSuccess(item: MailjetSendEmailMessageSuccess): SendEmailMessageSuccess {
  return {
    id: item.CustomID,
    to: item.To.map((item) => ({
      email: item.Email,
      emailProviderMessageId: item.MessageUUID,
    })),
    bcc: item.Bcc?.map((item) => ({
      email: item.Email,
      emailProviderMessageId: item.MessageUUID,
    })),
    cc: item.Cc?.map((item) => ({
      email: item.Email,
      emailProviderMessageId: item.MessageUUID,
    })),
  };
}
