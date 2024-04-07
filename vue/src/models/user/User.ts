import { IUser } from "../../interfaces/user/IUser";

class User implements IUser {
  id: number | null;
  username: string | null;
  domain: string | null;

  constructor(user: IUser) {
    this.id = user.id;
    this.username = user.username;
    this.domain = user.domain;
  }
}

export { User };
