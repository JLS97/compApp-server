import {TemplateEmailMessage} from '../../../domain/email/types.js';
import {parseGeneralMessage} from './parseGeneralMessage.js';

export function parseTemplateMessage(message: TemplateEmailMessage) {
  return {
    ...parseGeneralMessage(message),
    TemplateID: message.templateId,
    TemplateLanguage: message.templateLanguage,
  };
}
