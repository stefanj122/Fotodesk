import { emailLogger } from './logger.helper';
import { MailDataT } from 'src/types/mail-data.type';

export function sendMail(mailData: MailDataT): Promise<boolean> {
  const { email, subject, template, context, mailerService } = mailData;

  return mailerService
    .sendMail({
      to: email,
      from: process.env.APP_NO_REPLY_EMAIL,
      subject,
      template,
      context: context,
    })
    .then((response) => {
      emailLogger.log({
        level: 'info',
        message: JSON.stringify(response),
        type: subject,
      });
      return true;
    })
    .catch((error) => {
      emailLogger.log({
        level: 'error',
        message: JSON.stringify(error),
        type: subject,
      });
      return false;
    });
}
