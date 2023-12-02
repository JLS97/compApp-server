import {EmailAddressInfo, EmailAttachment, EmailMessage} from '../../../domain/email/types.js';

export function parseGeneralMessage(message: EmailMessage) {
  return {
    From: parseEmailAddressInfo(message.from),
    To: message.to.map(parseEmailAddressInfo),
    CC: message.cc?.map(parseEmailAddressInfo),
    BCC: message.bcc?.map(parseEmailAddressInfo),
    Subject: message.subject,
    Variables: message.variables,
    Attachments: message.attachments?.map(parseEmailAttachment),
    Headers: message.headers,
    CustomID: message.customId,
    EventPayload: message.eventPayload,
    CustomCampaign: message.customCampaign,
    DeduplicateCampaign: message.deduplicateCampaign,
    URLTags: message.urlTags ? encodeURI(message.urlTags) : undefined,
  };
}

function parseEmailAddressInfo(address: EmailAddressInfo) {
  return {
    Email: address.email,
    Name: address.name,
  };
}

function parseEmailAttachment(attachment: EmailAttachment) {
  return {
    ContentType: attachment.contentType,
    Filename: attachment.fileName,
    Base64Content: attachment.base64Content,
    ContentID: attachment.contentId,
  };
}
