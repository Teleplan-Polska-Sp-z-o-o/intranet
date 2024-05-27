import { emailConfig } from "../../../config/email";
import nodemailer from "nodemailer";
import { IEmailOptions } from "../../../interfaces/Email/IEmailOptions";
import { IEmailFrom } from "../../../interfaces/Email/IEmailFrom";
import { Email } from "./Email";
import SMTPTransport from "nodemailer/lib/smtp-transport";

class EmailHandler {
  private static instance: EmailHandler;
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  private constructor() {}

  public static getInstance(): EmailHandler {
    if (!EmailHandler.instance) {
      EmailHandler.instance = new EmailHandler();
      const { domain, ...updatedEmailConfig } = emailConfig;
      this.instance.transporter = nodemailer.createTransport(updatedEmailConfig);
    }
    return EmailHandler.instance;
  }

  public newEmail = (options: IEmailOptions): Email => {
    const optionsWithFrom: IEmailOptions & IEmailFrom = {
      ...options,
      from: `"BYD-Intranet" <${emailConfig.auth.user}>`,
    };
    return new Email(optionsWithFrom, EmailHandler.instance.transporter);
  };
}

export { EmailHandler };
