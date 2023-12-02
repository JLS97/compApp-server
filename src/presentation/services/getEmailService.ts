import {ENV} from '../../env.js';
import {MailjetEmailService} from '../../infrastructure/email/mailjet/MailjetEmailService.js';
import {NoopEmailService} from '../../infrastructure/email/noop/NoopEmailService.js';

let mailjetEmailService: MailjetEmailService;
let noopEmailService: NoopEmailService;

const getMailjetEmailService = () => {
  if (mailjetEmailService) {
    return mailjetEmailService;
  }

  mailjetEmailService = new MailjetEmailService({
    key: ENV.EMAIL_MAILJET_KEY,
    secret: ENV.EMAIL_MAILJET_SECRET,
    dryRun: ENV.EMAIL_MAILJET_DRY_RUN,
  });

  return mailjetEmailService;
};

const getNoopEmailService = () => {
  if (noopEmailService) {
    return noopEmailService;
  }

  noopEmailService = new NoopEmailService();

  return noopEmailService;
};

export function getEmailService() {
  switch (ENV.EMAIL_SERVICE_TYPE) {
    case 'mailjet':
      return getMailjetEmailService();
    case 'none':
      return getNoopEmailService();
    default:
      throw new Error(`Email service not supported. Received: ${ENV.EMAIL_SERVICE_TYPE}`);
  }
}
