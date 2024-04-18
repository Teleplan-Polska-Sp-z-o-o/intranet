interface INotificationEntity {
  id: number;
  state: string;
  source: string;
  action: string;
  title: string | null;
  subtitle: string | null;
  link: string;
  receivedDate: string;
}

export type { INotificationEntity };
