import {EmailMessage, SendEmailResponse} from './types.js';

export abstract class EmailService {
  abstract sendEmail(messages: EmailMessage[]): Promise<SendEmailResponse>;
}
