import {Email} from '../../../domain/email/types.js';
import {messageParser} from './messageParser.js';

export function emailParser(email: Email) {
  return {
    Messages: email.messages.map(messageParser),
    SandboxMode: email.dryRun,
  };
}
