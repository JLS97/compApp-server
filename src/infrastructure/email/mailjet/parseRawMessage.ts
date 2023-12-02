import {RawEmailMessage} from '../../../domain/email/types.js';
import {parseGeneralMessage} from './parseGeneralMessage.js';

export function parseRawMessage(message: RawEmailMessage) {
  return {
    ...parseGeneralMessage(message),
    TextPart: message.text,
    HTMLPart: message.html,
  };
}
