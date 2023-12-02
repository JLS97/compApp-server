import {EmailMessage, SendEmailResponse} from '../../../domain/email/types.js';
import {EmailService} from '../../../domain/email/EmailService.js';

export class NoopEmailService extends EmailService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendEmail(messages: EmailMessage[]): Promise<SendEmailResponse> {
    return {
      emailProviderRawResponse: '',
      messages: [],
    };
  }
}
