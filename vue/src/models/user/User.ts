import { IUser } from "../../interfaces/user/IUser";
import { IUserEntity } from "../../interfaces/user/IUserEntity";

class User implements IUser {
  id: number;
  username: string;
  domain: string;

  constructor(user?: IUser | IUserEntity) {
    this.id = user ? user.id : 0;
    this.username = user ? user.username : "";
    this.domain = user ? user.domain : "";
  }
}

export { User };
