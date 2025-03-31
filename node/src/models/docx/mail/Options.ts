import { IEmailAttachment } from "../../../interfaces/Email/IEmailAttachment";
import { IEmailOptions } from "../../../interfaces/Email/IEmailOptions";

export enum EEmailVariant {
  RELEASE = "release",
}

const predefinedTo: Record<EEmailVariant, { to: string[]; cc: string[] }> = {
  [EEmailVariant.RELEASE]: { to: [], cc: [] },
};

const predefinedSubject: Record<EEmailVariant, { subject: string }> = {
  [EEmailVariant.RELEASE]: { subject: `TransCreateDocs - Document Released` },
};

// export class EmailContentOptions {
//   title: string;
//   subtitle: string;
//   link: string;

//   constructor(documentIdRevision: string) {
//     this.title = `Intranet Notification`;
//     this.subtitle = `Document ${documentIdRevision} has been successfully released.`;
//     this.link = `/tool/tcd/browse/released`;
//   }
// }

export class EmailHandlerOptions implements IEmailOptions {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  html: string;
  attachments?: IEmailAttachment[];

  constructor(variant: EEmailVariant, html: string, attachments?: IEmailAttachment[]) {
    this.to = predefinedTo[variant].to;
    this.cc = predefinedTo[variant].cc;
    this.subject = predefinedSubject[variant].subject;
    this.html = html;
    this.attachments = attachments;
  }
}
