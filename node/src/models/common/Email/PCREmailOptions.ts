import { emailConfig } from "../../../config/email";
import { serverConfig } from "../../../config/server";
import { IEmailContent } from "../../../interfaces/Email/IEmailContent";
import { IEmailOptions } from "../../../interfaces/Email/IEmailOptions";
import { ProcessChangeRequest } from "../../../orm/entity/change/ProcessChangeRequestEntity";
import { template } from "./template";

class PCREmailOptions implements IEmailOptions {
  to: string;
  subject: string;
  html: string;

  private getSubject(variant: string): string {
    switch (variant) {
      case "reassigned":
        return "PCR Ownership Change";
      case "assigned":
      case "assigned completed":
      case "assigned updated":
        return "PCR Ownership Change";
      case "completed":
        return "PCR Completion";
      case "updated":
      case "updated uncompleted":
        return "PCR Update";
      case "closed":
        return "PCR Closure";
      default:
        return "Notification";
    }
  }

  //   private template = (text: string, link: string): string => {
  //     return `<!DOCTYPE html>
  // <html lang="en">
  // <head>
  //   <meta charset="UTF-8">
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //   <title>Email Template</title>
  //   <style>
  //     body {
  //       font-family: Arial, sans-serif;
  //       line-height: 1.6;
  //     }
  //     .container {
  //       width: 300px;
  //       border: 1px solid #ccc;
  //     }
  //     h1 {
  //       color: #333;
  //       margin-bottom: 20px;
  //     }
  //     p {
  //       color: #666;
  //     }
  //     .small-text {
  //       font-size: 12px;
  //     }
  //     .button {
  //       display: inline-block;
  //       color: #007bff;
  //       text-decoration: none;
  //     }
  //   </style>
  // </head>
  // <body>
  //     <div class="container">
  //     <h1>Notification</h1>
  //     <p>
  //       ${text}
  //     </p>
  //     <a href="${link}" class="button">View Request</a>
  //     <p class="small-text">
  //       <div>
  //       If the link does not work, please visit:
  //       </div>
  //       <div>
  //       ${link}
  //       </div>
  //     </p>
  //   </div>
  //   </body>
  // </html>`;
  //   };

  private getText(variant: string, request: ProcessChangeRequest): string {
    switch (variant) {
      case "reassigned":
        return `You are no longer the owner of request ${request.numberOfRequest}.`;
      case "assigned":
        return `You have been assigned as the owner of request ${request.numberOfRequest}. You will be notified when it's ready for your review.`;
      case "assigned completed":
        return `You have been assigned as the owner of request ${request.numberOfRequest}, which has been completed and is awaiting your review.`;
      case "assigned updated":
        return `You have been assigned as the owner of request ${request.numberOfRequest}, which has been updated and is awaiting your review.`;
      case "completed":
        return `Request ${request.numberOfRequest} has been completed and is awaiting your review.`;
      case "updated":
        return `Request ${request.numberOfRequest} has been updated and is awaiting your review.`;
      case "updated uncompleted":
        return `Request ${request.numberOfRequest} has been updated, but some fields have been cleared. You will be notified when it's ready for your review.`;
      case "closed":
        return `Request ${request.numberOfRequest} has been successfully closed. The assessment has been set to '${request.assessment}'. Should any updates occur, you will be promptly notified and asked for review once more.`;
    }
  }

  constructor(variant: string, request: ProcessChangeRequest) {
    const requestLink = `${serverConfig.origin}/tool/change/browse/pcr/${request.id}`;
    const notificationCenterLink = `${serverConfig.origin}/pages/settings/notification`;
    const ifLinksFail = `If the buttons within the email fail to activate upon clicking, please navigate to the following URL using your web browser: ${serverConfig.origin}`;
    const reconextCom = `https://www.reconext.com/`;
    const name = `${request.reconextOwner.split(" ").at(0)},`;

    this.to = `${request.reconextOwner.toLocaleLowerCase().replace(" ", ".")}@${
      emailConfig.domain
    }`;
    this.subject = this.getSubject(variant);

    const configuration: IEmailContent = {
      title: "Intranet Notification",
      subtitle: this.getSubject(variant),
      textTitle: name,
      text: this.getText(variant, request),
      button1Href: requestLink,
      button1Text: "Go to PCR",
      button2Href: notificationCenterLink,
      button2Text: "Notification Center",
      underButtonsText: ifLinksFail,
    };

    this.html = template(configuration);
  }
}

export { PCREmailOptions };
