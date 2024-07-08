import { IUser } from "../../interfaces/user/UserTypes";
import { IUserEntity } from "../../interfaces/user/IUserEntity";
import { UserEntity } from "./UserEntity";

class User implements IUser {
  id: number;
  username: string;
  domain: string;

  constructor() {
    this.id = 0;
    this.username = "";
    this.domain = "";
  }

  public build = (user: IUser | IUserEntity | UserEntity): User => {
    this.id = user.id;
    this.username = user.username;
    this.domain = user.domain;

    return this;
  };
}

export { User };
