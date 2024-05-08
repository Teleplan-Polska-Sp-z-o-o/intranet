import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";
import { IEmailFrom } from "../../../interfaces/Email/IEmailFrom";
import { IEmailOptions } from "../../../interfaces/Email/IEmailOptions";

class Email {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private transport: IEmailOptions & IEmailFrom;

  constructor(
    options: IEmailOptions & IEmailFrom,
    transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>
  ) {
    this.transporter = transporter;
    this.transport = options;
  }

  public send = async (): Promise<string> => {
    try {
      const info = await this.transporter.sendMail(this.transport);
      return info.messageId;
    } catch (error) {
      console.log(error);
    }
  };
}

export { Email };
