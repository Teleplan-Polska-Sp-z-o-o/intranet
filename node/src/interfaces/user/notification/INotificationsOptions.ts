import { User } from "../../../orm/entity/user/UserEntity";

type Where = {
  user: User;
  state: string;
};

interface INotificationsOptions {
  where: Partial<Where>;
  order: { id: "DESC" };
  take: number;
}

export type { INotificationsOptions };
