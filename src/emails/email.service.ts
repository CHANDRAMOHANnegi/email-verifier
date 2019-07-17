import { Injectable } from '@nestjs/common';
import * as verifier from 'email-verify';
import ServerResponse from './ServerResponse';
import { promisify } from 'util';

const COMMON_EMAIL_ADDRESS: string[] = ['contact', 'in@fo', 'admin', 'hello'];

@Injectable()
export class EmailService {

  private myEmailVerify = promisify(verifier.verify);

  async verifyEmails(emails: string[]): Promise<ServerResponse[]> {  // email = anas@bitcs.in
    const promises: Array<Promise<ServerResponse>> = emails.map(email =>
      new Promise(resolve => {
          verifier.verify(email, (err, info) => {
            if (err) {
              resolve(ServerResponse.error('err', 400));
            } else {

              if (info.success) {
                resolve(ServerResponse.success(info.info, info));
              } else {
                resolve(ServerResponse.error(info.info, info));
              }
            }
          });
        },
      ));
    return Promise.all(promises);
  }

  async verifyEmail(providedEmail: string): Promise<ServerResponse> {

    const response1 = await this.myEmailVerify(providedEmail);

    // if  code === 1 then  email structure is correct  but  it may  be  valid  or invalid

    if (response1.code === 1) {

      const domain = providedEmail.split('@')[1];
      const newEmails = COMMON_EMAIL_ADDRESS.map(commonEmail => commonEmail + '@' + domain);

      const response = await this.verifyEmails(newEmails);
      let probability = '50%';
      const totalEmails = COMMON_EMAIL_ADDRESS.length + 1;

      const validEmails = response.filter(Email => Email.success);
      const inValidEmails = response.filter(Email => !Email.success);

      let validEmailsLength = validEmails.length;
      const inValidEmailsLength = inValidEmails.length;
      if (response1.success) {
        validEmailsLength++;
      }

      console.log(validEmailsLength, inValidEmailsLength);
      if (validEmailsLength === 0 && !response1.success) {
        probability = '40%';
      } else if ((validEmailsLength < totalEmails) && response1.success) {
        probability = '100%';
      } else if ((validEmailsLength < totalEmails) && !response1.success) {
        probability = '0%';
      } else if (validEmailsLength === totalEmails && response1.success) {
        probability = '50%';
      }
      return ServerResponse.success(response1.info, {
        probability,
        validEmails,
        inValidEmails,
      });
    }
    return ServerResponse.error(response1.info);
  }
}

// 1. get name and domain seperately
// create multiple emails using same this domain and words above.
// fetch VerifySingleEmail for each email address
// if list of valid emails are same as number of emails we tested, then probability would be 50%
// if list of valid emails are lesser than number of emails we tested, and the email provided is in the valid email list then probability would be 100$
// if list of valid emails are lesser than number of emails we tested, and the email provided is not in the valid email list then probability would be 0$
// if list of valid emails are 0, then probability would be 40%
