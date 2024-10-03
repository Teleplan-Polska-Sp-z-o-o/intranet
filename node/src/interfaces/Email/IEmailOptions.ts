import { IEmailAttachment } from "./IEmailAttachment";

interface IEmailOptions {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  html: string;
  attachments?: IEmailAttachment[];
}

export { IEmailOptions };
