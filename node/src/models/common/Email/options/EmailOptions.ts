import { IEmailOptions } from "../../../../interfaces/Email/IEmailOptions";
import { IEmailAttachment } from "../../../../interfaces/Email/IEmailAttachment";

class EmailOptions implements IEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string | string[];
  attachments?: IEmailAttachment[];

  constructor(
    to: string | string[],
    subject: string,
    html: string,
    cc?: string | string[],
    attachments?: IEmailAttachment[]
  ) {
    this.to = to;
    this.subject = subject;
    this.html = html;
    this.cc = cc;
    this.attachments = attachments;
  }
}

export { EmailOptions };
