import { emailConfig } from "../../../config/email";
import { serverConfig } from "../../../config/server";
import { IEmailContent } from "../../../interfaces/Email/IEmailContent";
import { IEmailOptions } from "../../../interfaces/Email/IEmailOptions";
import { ProcessChangeNotice } from "../../../orm/entity/change/ProcessChangeNoticeEntity";
import { User } from "../../../orm/entity/user/UserEntity";
import { template } from "./template";

class PCNEmailOptions implements IEmailOptions {
  to: string;
  subject: string;
  html: string;

  private getSubject(variant: string): string {
    switch (variant) {
      case "reassigned":
      case "assigned":
        return "PCR Person Designated Change";
      case "completed":
        return "PCN Completion";
      case "updated completed":
        return "PCN Updated and Completed";
      case "updated uncompleted":
        return "PCN Update";
      //
      //
      case "engineering approval":
        return "PCN Engineering Approval";
      case "quality approval":
        return "PCN Quality Approval";
      //
      //
      case "updated engineering approval":
        return "PCN Updated and Engineering Approved";
      case "updated quality approval":
        return "PCN Updated and Quality Approved";
      default:
        return "Notification";
    }
  }

  private getText(variant: string, notice: ProcessChangeNotice): string {
    switch (variant) {
      case "reassigned":
        return `You are no longer the person designated of notice ${notice.numberOfNotice}.`;
      case "assigned":
        return `You have been assigned as the person designated of notice ${notice.numberOfNotice}.`;
      case "completed":
        return `Notice ${notice.numberOfNotice} has been completed and is awaiting your review.`;
      case "engineering approval":
        return `Notice ${notice.numberOfNotice} has been approved by the engineering department and is awaiting further review.`;
      case "quality approval":
        return `Notice ${notice.numberOfNotice} has been approved by the quality department and is awaiting further review.`;
      case "updated completed":
        return `Notice ${notice.numberOfNotice} has been updated and completed. Please review the changes.`;
      case "updated uncompleted":
        return `Notice ${notice.numberOfNotice} has been updated, but some fields remain incomplete. You will be notified when it's ready for review.`;
      case "updated engineering approval":
        return `Notice ${notice.numberOfNotice} has been updated and approved by the engineering department. It is now awaiting further review.`;
      case "updated quality approval":
        return `Notice ${notice.numberOfNotice} has been updated and approved by the quality department. It is now awaiting further review.`;
    }
  }

  constructor(variant: string, notice: ProcessChangeNotice, recipient: User) {
    const noticeLink = `${serverConfig.origin}/tool/change/browse/pcn/${notice.id}`;
    const notificationCenterLink = `${serverConfig.origin}/pages/settings/notification`;
    const ifLinksFail = `If the buttons within the email fail to activate upon clicking, please navigate to the following URL using your web browser: ${serverConfig.origin}`;
    const lowerCasedName = recipient.username.split(".").at(0);
    const name = lowerCasedName.charAt(0).toUpperCase() + lowerCasedName.slice(1);
    this.to = `${recipient.username}@${emailConfig.domain}`;
    this.subject = this.getSubject(variant);

    const configuration: IEmailContent = {
      title: "Intranet Notification",
      subtitle: this.getSubject(variant),
      textTitle: name,
      text: this.getText(variant, notice),
      button1Href: noticeLink,
      button1Text: "Go to PCR",
      button2Href: notificationCenterLink,
      button2Text: "Notification Center",
      underButtonsText: ifLinksFail,
    };

    this.html = template(configuration);
  }
}

export { PCNEmailOptions };
