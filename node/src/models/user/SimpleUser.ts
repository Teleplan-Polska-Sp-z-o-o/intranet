import { IUser } from "../../interfaces/user/UserTypes";

class SimpleUser implements IUser {
  id: number;
  username: string;
  domain: string;

  constructor() {
    this.id = 0;
    this.username = "";
    this.domain = "";
  }

  public build = (user: IUser): SimpleUser => {
    this.id = user.id;
    this.username = user.username;
    this.domain = user.domain;

    return this;
  };
}

export { SimpleUser };
