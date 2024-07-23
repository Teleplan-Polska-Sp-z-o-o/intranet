import { emailConfig } from "../../../../config/email";
import { serverConfig } from "../../../../config/server";
import { IEmailContent } from "../../../../interfaces/Email/IEmailContent";
import { IEmailOptions } from "../../../../interfaces/Email/IEmailOptions";
import { ENotificationVariant } from "../../../../interfaces/user/notification/ENotificationVariant";
import { ProcessChangeNotice } from "../../../../orm/entity/change/ProcessChangeNoticeEntity";
import { User } from "../../../../orm/entity/user/UserEntity";
import { template } from "../template";

class PCNEmailOptions implements IEmailOptions {
  variant: ENotificationVariant;
  to: string;
  subject: string;
  html: string;

  private getSubject(variant: string): string {
    switch (variant) {
      case ENotificationVariant.Reassigned:
      case ENotificationVariant.Assigned:
        return "PCN Person Designated Change";
      case ENotificationVariant.Completed:
        return "PCN Completion";
      case ENotificationVariant.UpdatedCompleted:
        return "PCN Updated and Completed";
      case ENotificationVariant.UpdatedUncompleted:
        return "PCN Update";
      //
      //
      case ENotificationVariant.EngineeringApproval:
        return "PCN Engineering Approval";
      case ENotificationVariant.QualityApproval:
        return "PCN Quality Approval";
      //
      //
      case ENotificationVariant.UpdatedEngineeringApproval:
        return "PCN Updated and Engineering Approved";
      case ENotificationVariant.UpdatedQualityApproval:
        return "PCN Updated and Quality Approved";
      default:
        return "Notification";
    }
  }

  private getText(variant: string, notice: ProcessChangeNotice): string {
    switch (variant) {
      case ENotificationVariant.Reassigned:
        return `You are no longer the person designated of notice ${notice.numberOfNotice}.`;
      case ENotificationVariant.Assigned:
        return `You have been assigned as the person designated of notice ${notice.numberOfNotice}.`;
      case ENotificationVariant.Completed:
        return `Notice ${notice.numberOfNotice} has been completed and is awaiting your review.`;
      case ENotificationVariant.EngineeringApproval:
        return `Notice ${notice.numberOfNotice} has been approved by the engineering department and is awaiting further review.`;
      case ENotificationVariant.QualityApproval:
        return `Notice ${notice.numberOfNotice} has been approved by the quality department and is awaiting further review.`;
      case ENotificationVariant.UpdatedCompleted:
        return `Notice ${notice.numberOfNotice} has been updated and completed. Please review the changes.`;
      case ENotificationVariant.UpdatedUncompleted:
        return `Notice ${notice.numberOfNotice} has been updated, but some fields remain incomplete. You will be notified when it's ready for review.`;
      case ENotificationVariant.UpdatedEngineeringApproval:
        return `Notice ${notice.numberOfNotice} has been updated and approved by the engineering department. It is now awaiting further review.`;
      case ENotificationVariant.UpdatedQualityApproval:
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
