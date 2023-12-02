import {EmailMessage, RawEmailMessage, TemplateEmailMessage} from '../../../domain/email/types.js';
import {parseRawMessage} from './parseRawMessage.js';
import {parseTemplateMessage} from './parseTemplateMessage.js';

export function messageParser(message: EmailMessage) {
  const rawMessage = message as RawEmailMessage;
  if (rawMessage.html || rawMessage.text) {
    return parseRawMessage(rawMessage);
  }

  const templateMessage = message as TemplateEmailMessage;
  if (templateMessage.templateId) {
    return parseTemplateMessage(templateMessage);
  }

  throw new Error(`Message not supported. Received: ${JSON.stringify(message)}`);
}
