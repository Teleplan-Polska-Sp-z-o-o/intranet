import { ENotificationAction } from "../../../interfaces/user/notification/ENotificationAction";
import { ENotificationSource } from "../../../interfaces/user/notification/ENotificationSource";
import { ENotificationState } from "../../../interfaces/user/notification/ENotificationState";
import { INotification } from "../../../interfaces/user/notification/INotification";
import { INotificationEntity } from "../../../interfaces/user/notification/INotificationEntity";
import moment from "moment";

class UserNotification implements INotification {
  id: number;
  state: ENotificationState;
  source: ENotificationSource;
  action: ENotificationAction;
  title: string | null;
  subtitle: string | null;
  link: string;
  receivedDate: string;

  private mapState(stateString: string): ENotificationState {
    switch (stateString) {
      case "Unread":
        return ENotificationState.Unread;
      case "Read":
        return ENotificationState.Read;
      case "Archived":
        return ENotificationState.Archived;
      default:
        throw new Error(
          `Invalid notification state: ${stateString}. Accepted values: Unread, Read, Archived.`
        );
    }
  }

  private mapSource(sourceString: string): ENotificationSource {
    switch (sourceString) {
      case "DCR":
        return ENotificationSource.DCR;
      case "DCN":
        return ENotificationSource.DCN;
      case "PCR":
        return ENotificationSource.PCR;
      case "PCN":
        return ENotificationSource.PCN;
      default:
        throw new Error(`Invalid notification source: ${sourceString}. Accepted values: PCR.`);
    }
  }

  private mapAction(actionString: string): ENotificationAction {
    switch (actionString) {
      case "mdi-eye":
        return ENotificationAction.ViewDetails;
      case "mdi-thumbs-up-down-outline":
        return ENotificationAction.AcceptOrReject;
      case "mdi-reply":
        return ENotificationAction.ReplyOrRespond;
      default:
        throw new Error(
          `Invalid notification action: ${actionString}. Accepted values: mdi-eye, mdi-thumbs-up-down-outline, mdi-reply.`
        );
    }
  }

  constructor(notification: INotificationEntity) {
    this.id = notification.id;
    this.state = this.mapState(notification.state);
    this.source = this.mapSource(notification.source);
    this.action = this.mapAction(notification.action);
    this.title = notification.title;
    this.subtitle = notification.subtitle;
    this.link = notification.link;
    this.receivedDate = notification.receivedDate;
  }

  public getTimeElapsed(): string {
    const date: moment.Moment = moment.utc(this.receivedDate); // Parse date string as UTC
    const now: moment.Moment = moment.utc(); // Get current time in UTC

    const diff: moment.Duration = moment.duration(now.diff(date));

    const days: number = Math.floor(diff.asDays());
    const hours: number = Math.floor(diff.asHours());
    const minutes: number = Math.floor(diff.asMinutes());

    let elapsedString: string = "";
    if (days > 0) {
      elapsedString += `${days} day`;
      if (days > 1) {
        elapsedString += "s";
      }
    } else if (hours > 0) {
      elapsedString += `${hours} hr`;
      if (hours > 1) {
        elapsedString += "s";
      }
    } else {
      elapsedString += `${minutes} min`;
    }

    return elapsedString;
  }

  public getTime(): string {
    const date: moment.Moment = moment.utc(this.receivedDate); // Parse date string as UTC

    const formattedDate: string = date.format("MM/DD/YYYY");

    return formattedDate;
  }
}

export { UserNotification };
