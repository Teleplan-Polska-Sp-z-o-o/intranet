import { IUserEntity } from "../../interfaces/user/IUserEntity";

export class UserEntity implements IUserEntity {
  domain: string;
  id: number;
  permission: {
    read: boolean;
    write: boolean;
    control: boolean;
    id: number;
  };
  settings: {
    theme: string;
    language: string;
    id: number;
  };
  username: string;

  constructor() {
    this.domain = "";
    this.id = 0;
    this.permission = { read: true, write: false, control: false, id: 0 };
    this.settings = { theme: "", language: "", id: 0 };
    this.username = "";
  }
}
