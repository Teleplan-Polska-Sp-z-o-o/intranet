import { IUserEntity } from "../../interfaces/user/IUserEntity";
import { TConfidentiality, UserGroup } from "../../interfaces/user/UserTypes";
import { LDAPUser } from "../../interfaces/user/TLDAP";

export class UserEntity implements IUserEntity {
  domain: string;
  id: number;
  permission: {
    read: boolean;
    write: boolean;
    control: boolean;
    confidentiality: TConfidentiality;
    groups: Array<UserGroup>;
    id: number;
  };
  settings: {
    theme: string;
    language: "pl" | "en" | "ua";
    id: number;
  };
  username: string;
  info: {
    position: string | null;
    department: string | null;
    decisionMaker: boolean | null;
    LDAPObject: LDAPUser | null;
  };

  constructor() {
    this.domain = "";
    this.id = 0;
    this.permission = {
      read: true,
      write: false,
      control: false,
      confidentiality: "public",
      groups: [],
      id: 0,
    };
    this.settings = { theme: "", language: "en", id: 0 };
    this.username = "";
    this.info = { position: null, department: null, decisionMaker: null, LDAPObject: null };
  }

  public buildFromUserEntity = (entity: UserEntity): UserEntity => {
    this.domain = entity.domain;
    this.id = entity.id;
    this.permission = entity.permission;
    this.settings = entity.settings;
    this.username = entity.username;
    this.info = entity.info;

    return this;
  };
}
