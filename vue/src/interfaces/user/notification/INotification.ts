import { ENotificationAction } from "./ENotificationAction";
import { ENotificationSource } from "./ENotificationSource";
import { ENotificationState } from "./ENotificationState";

interface INotification {
  id: number;
  state: ENotificationState;
  source: ENotificationSource;
  action: ENotificationAction;
  title: string | null;
  subtitle: string | null;
  link: string;
  receivedDate: string;
}

export type { INotification };
