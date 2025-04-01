import { IEmailAttachment } from "../../../interfaces/Email/IEmailAttachment";
import { EmailHandler } from "../../common/Email/EmailHandler";
import { EEmailVariant, EmailHandlerOptions } from "./Options";

export class Mailer {
  emailHandler: EmailHandler = EmailHandler.getInstance();

  constructor() {}

  send(variant: EEmailVariant, attachments: IEmailAttachment[]) {
    const html = "";
    const options = new EmailHandlerOptions(variant, html, attachments);
    this.emailHandler.newEmail(options).send();
  }
}
