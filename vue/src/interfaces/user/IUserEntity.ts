import { TConfidentiality } from "./TConfidentiality";
import { LDAPUser } from "./TLDAP";

interface IUserEntity {
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
}

export type { IUserEntity };
