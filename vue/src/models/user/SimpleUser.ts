import { IUser } from "../../interfaces/user/UserTypes";
import { IUserEntity } from "../../interfaces/user/IUserEntity";
import { UserEntity } from "./UserEntity";

class SimpleUser implements IUser {
  id: number;
  username: string;
  domain: string;

  constructor() {
    this.id = 0;
    this.username = "";
    this.domain = "";
  }

  public build(user: IUser | IUserEntity | UserEntity): this {
    this.id = user.id;
    this.username = user.username;
    this.domain = user.domain;

    return this;
  }

  public getNormalizedUsername(): string {
    if (!this.username) throw Error("Username is empty string.");
    const parts = this.username.split(".");

    const removeNumbers = (s: string) => s.replace(/\d+/g, "");
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

    return `${capitalize(removeNumbers(parts[0]))} ${capitalize(removeNumbers(parts[1]))}`;
  }
}

export { SimpleUser };
