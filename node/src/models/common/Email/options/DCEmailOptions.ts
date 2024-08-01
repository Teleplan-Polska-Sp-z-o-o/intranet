import { emailConfig } from "../../../../config/email";
import { serverConfig } from "../../../../config/server";
import { IEmailContent } from "../../../../interfaces/Email/IEmailContent";
import { IEmailOptions } from "../../../../interfaces/Email/IEmailOptions";
import {
  EDCNotificationVariant,
  ENotificationVariant,
} from "../../../../interfaces/user/notification/ENotificationVariant";
import { DocumentChange } from "../../../../orm/entity/change/documents/DocumentChangeEntity";
import { User } from "../../../../orm/entity/user/UserEntity";
import { template } from "../template";

class DCREmailOptions implements IEmailOptions {
  variant: ENotificationVariant;
  to: string;
  cc?: string[];
  subject: string;
  html: string;

  private getSubject(variant: EDCNotificationVariant): string {
    switch (variant) {
      case EDCNotificationVariant.Completed:
        return `DCR Completed`;
      case EDCNotificationVariant.Updated:
        return `DCR Updated`;

      case EDCNotificationVariant.Checked:
        return `DCR Checked`;
      case EDCNotificationVariant.Approved:
        return `DCR Approved`;
      case EDCNotificationVariant.Registered:
        return `DCR Registered`;
      case EDCNotificationVariant.Unregistered:
        return `DCR Unregistered`;
      case EDCNotificationVariant.CheckFailed:
        return `DCR Check Failed`;
      case EDCNotificationVariant.ApprovalFailed:
        return `DCR Approval Failed`;
      case EDCNotificationVariant.RegisterFailed:
        return `DCR Register Failed`;
      default:
        return `Notification`;
    }
  }

  private getText(variant: string, request: DocumentChange, to: User): string {
    const [name, surname] = to.username.split(".");
    const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    const formalName = `${capitalize(name)} ${capitalize(surname)}`;

    switch (variant) {
      case EDCNotificationVariant.Completed:
        return `DCR ${request.no} has been completed. ${formalName}, please review.`;

      case EDCNotificationVariant.Updated:
        return `DCR ${request.no} has been updated. ${formalName}, please review the changes.`;
      case EDCNotificationVariant.Checked:
        return `DCR ${request.no} has been checked. ${formalName}, it is now awaiting your approval.`;
      case EDCNotificationVariant.Approved:
        return `DCR ${request.no} has been approved. ${formalName}, it is now awaiting registration.`;
      case EDCNotificationVariant.Registered:
        return `DCR ${request.no} has been registered. Comment: ${
          request.registererComment || `N/A`
        }`;
      case EDCNotificationVariant.Unregistered:
        return `DCR ${request.no} has been unregistered. Comment: ${
          request.registererComment || `N/A`
        }`;
      case EDCNotificationVariant.CheckFailed:
        return `DCR ${
          request.no
        } check has failed. ${formalName}, please review the issues. Comment: ${
          request.checkerComment || `N/A`
        }`;
      case EDCNotificationVariant.ApprovalFailed:
        return `DCR ${
          request.no
        } approval has failed. ${formalName}, please review the issues. Comment: ${
          request.approverComment || `N/A`
        }`;
      case EDCNotificationVariant.RegisterFailed:
        return `DCR ${
          request.no
        } register has failed. ${formalName}, please review the issues. Comment: ${
          request.approverComment || `N/A`
        }`;
    }
  }

  constructor(variant: EDCNotificationVariant, request: DocumentChange, to: User, cc: User[]) {
    const requestLink = `${serverConfig.origin}/tool/change/browse/dcr/${request.id}`;
    const notificationCenterLink = `${serverConfig.origin}/pages/settings/notification`;
    const ifLinksFail = `If the buttons within the email fail to activate upon clicking, please navigate to the following URL using your web browser: ${serverConfig.origin}`;
    const lowerCasedName = to.username.split(".").at(0);
    const name = lowerCasedName.charAt(0).toUpperCase() + lowerCasedName.slice(1);
    this.to = `${to.username}@${emailConfig.domain}`;
    this.cc = cc.map((user) => {
      return `${user.username}@${emailConfig.domain}`;
    });

    this.subject = this.getSubject(variant);

    const configuration: IEmailContent = {
      title: "Intranet Notification",
      subtitle: this.getSubject(variant),
      textTitle: name,
      text: this.getText(variant, request, to),
      button1Href: requestLink,
      button1Text: "Go to DCR",
      button2Href: notificationCenterLink,
      button2Text: "Notification Center",
      underButtonsText: ifLinksFail,
    };

    this.html = template(configuration);
  }
}

export { DCREmailOptions };
