import { IUser, TConfidentiality, UserGroup } from "./UserTypes";
import { LDAPUser } from "./TLDAP";

interface IUserEntity extends IUser {
  domain: string;
  id: number;
  permission: {
    confidentiality: TConfidentiality;
    groups: Array<UserGroup>;
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
}

export type { IUserEntity };
