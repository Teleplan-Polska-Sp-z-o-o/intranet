import { Helper } from "../../../models/common/Helper";
import { User } from "./UserEntity";
import { UserNotification } from "./UserNotificationEntity";
import { ENotificationAction } from "../../../interfaces/user/notification/ENotificationAction";
import { ENotificationSource } from "../../../interfaces/user/notification/ENotificationSource";
import { ENotificationState } from "../../../interfaces/user/notification/ENotificationState";
import { INotification } from "../../../interfaces/user/notification/INotification";

class NotificationBuilder {
  private state: string;
  private source: string;
  private action: string;
  private title: string;
  private subtitle: string | null;
  private link: string;
  private receivedDate: string;
  private user: User;

  constructor(source: ENotificationSource, action: ENotificationAction) {
    this.state = ENotificationState.Unread;
    this.source = source;
    this.action = action;
    this.receivedDate = Helper.dateWithoutTimezone(new Date());
  }

  public setTitle(title: string | null): NotificationBuilder {
    this.title = title;
    return this;
  }

  public setSubtitle(subtitle: string | null): NotificationBuilder {
    this.subtitle = subtitle;
    return this;
  }

  public setLink(link: string): NotificationBuilder {
    this.link = link;
    return this;
  }

  public setUser(user: User): NotificationBuilder {
    this.user = user;
    return this;
  }

  private getProperties(): Partial<INotification> {
    return {
      // id <= Partial
      state: this.state,
      source: this.source,
      action: this.action,
      title: this.title,
      subtitle: this.subtitle,
      link: this.link,
      receivedDate: this.receivedDate,
      user: this.user,
    };
  }

  public build(): UserNotification {
    return new UserNotification().builder(this.getProperties());
  }
}

export { NotificationBuilder };
