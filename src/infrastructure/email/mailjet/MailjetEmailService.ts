import Mailjet, {Client} from 'node-mailjet';
import {EmailMessage, SendEmailResponse} from '../../../domain/email/types.js';
import {emailParser} from './emailParser.js';
import {EmailService} from '../../../domain/email/EmailService.js';
import {formatEmailResponse} from './formatEmailResponse.js';
import {MailjetSendEmailResponse} from './types.js';

export interface MailjetEmailServiceParams {
  key: string;
  secret: string;
  dryRun?: boolean;
}

export class MailjetEmailService extends EmailService {
  private _client: Client;
  private _dryRun: boolean;

  constructor(params: MailjetEmailServiceParams) {
    super();
    this._client = new Mailjet.Client({
      apiKey: params.key,
      apiSecret: params.secret,
    });

    this._dryRun = params.dryRun ?? false;
  }

  async sendEmail(messages: EmailMessage[]): Promise<SendEmailResponse> {
    const response = await this._client.post('send', {version: 'v3.1'}).request(
      emailParser({
        messages,
        dryRun: this._dryRun,
      })
    );

    const formattedResponse = formatEmailResponse(response.response.data as unknown as MailjetSendEmailResponse);

    return formattedResponse;
  }
}
