import { User } from "../../../orm/entity/user/UserEntity";

interface INotification {
  id: number;
  state: string;
  source: string;
  action: string;
  title: string;
  subtitle: string | null;
  link: string;
  receivedDate: string;
  user: User;
}

export type { INotification };
