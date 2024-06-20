import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserInformation } from "../../../models/user/UserInformation";
import { TLDAPUser } from "../../../interfaces/user/TLDAP";

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  position: string | null;

  @Column()
  department: string | null;

  @Column()
  decisionMaker: boolean | null;

  @Column()
  LDAPObject: string;

  constructor() {}

  public sanitizeAndAssignLDAPObject = (ldapUser: TLDAPUser | null): UserInfo => {
    if (ldapUser === null) return null;
    const sanitizedLdapUser = { ...ldapUser };

    // // Replace problematic values with a specific string
    // const replacementString = "VALUE_CANNOT_BE_STORED";

    // if (sanitizedLdapUser.objectGUID) {
    //   sanitizedLdapUser.objectGUID = replacementString;
    // }
    // if (sanitizedLdapUser.objectSid) {
    //   sanitizedLdapUser.objectSid = replacementString;
    // }
    // if (sanitizedLdapUser["mS-DS-ConsistencyGuid"]) {
    //   sanitizedLdapUser["mS-DS-ConsistencyGuid"] = replacementString;
    // }
    // if (sanitizedLdapUser.sIDHistory) {
    //   sanitizedLdapUser.sIDHistory = replacementString;
    // }

    const sanitizeJSONString = (jsonString: string): string => {
      // Remove null characters
      let sanitizedString = jsonString.replace(/\\u0000/g, "");

      // Escape backslashes
      sanitizedString = sanitizedString.replace(/\\/g, "\\\\");

      // Ensure valid Unicode escapes
      sanitizedString = sanitizedString.replace(/\\u([0-9A-Fa-f]{4})/g, "\\u$1");

      return sanitizedString;
    };

    this.LDAPObject = sanitizeJSONString(JSON.stringify(sanitizedLdapUser));

    return this;
  };

  public build = (info: UserInformation, fromLDAP: TLDAPUser = null) => {
    this.position = info.position;
    this.department = info.department;
    this.decisionMaker = info.decisionMaker;
    this.sanitizeAndAssignLDAPObject(fromLDAP);

    return this;
  };
}
