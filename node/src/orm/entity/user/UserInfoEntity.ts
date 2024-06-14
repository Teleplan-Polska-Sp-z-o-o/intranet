import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserInformation } from "../../../models/user/UserInformation";
import { LDAPUser } from "../../../interfaces/user/TLDAP";

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

  public sanitizeAndAssignLDAPObject = (ldapUser: LDAPUser | null): UserInfo => {
    if (ldapUser === null) return null;
    const sanitizedLdapUser = { ...ldapUser };

    // Replace problematic values with a specific string
    const replacementString = "VALUE_CANNOT_BE_STORED";

    if (sanitizedLdapUser.objectGUID) {
      sanitizedLdapUser.objectGUID = replacementString;
    }
    if (sanitizedLdapUser.objectSid) {
      sanitizedLdapUser.objectSid = replacementString;
    }
    if (sanitizedLdapUser["mS-DS-ConsistencyGuid"]) {
      sanitizedLdapUser["mS-DS-ConsistencyGuid"] = replacementString;
    }

    this.LDAPObject = JSON.stringify(sanitizedLdapUser);

    return this;
  };

  public build = (info: UserInformation, fromLDAP: LDAPUser = null) => {
    this.position = info.position;
    this.department = info.department;
    this.decisionMaker = info.decisionMaker;
    this.sanitizeAndAssignLDAPObject(fromLDAP);

    return this;
  };
}
