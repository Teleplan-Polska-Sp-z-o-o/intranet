import { IUserEntity } from "../../interfaces/user/IUserEntity";
import { TConfidentiality } from "../../interfaces/user/TConfidentiality";
import { LDAPUser } from "../../interfaces/user/TLDAP";

export class UserEntity implements IUserEntity {
  domain: string;
  id: number;
  permission: {
    read: boolean;
    write: boolean;
    control: boolean;
    confidentiality: TConfidentiality;
    id: number;
  };
  settings: {
    theme: string;
    language: string;
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
      id: 0,
    };
    this.settings = { theme: "", language: "", id: 0 };
    this.username = "";
    this.info = { position: null, department: null, decisionMaker: null, LDAPObject: null };
  }

  public buildFromIUserEntity(entity: IUserEntity): UserEntity {
    this.domain = entity.domain;
    this.id = entity.id;
    this.permission = entity.permission;
    this.settings = entity.settings;
    this.username = entity.username;
    this.info = entity.info;

    return this;
  }
}
