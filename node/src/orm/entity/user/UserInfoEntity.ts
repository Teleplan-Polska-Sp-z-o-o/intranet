import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserInformation } from "../../../models/user/UserInformation";
import { ILdapUser } from "../../../interfaces/user/ILDAP";

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

  public sanitizeAndAssignLDAPObject(ldapUser: ILdapUser | null): UserInfo {
    if (ldapUser === null) {
      this.LDAPObject = "";
      return this;
    }
    const sanitizedLdapUser = { ...ldapUser };

    const replacementString = "VALUE_CANNOT_BE_STORED";

    // Function to check if a string contains only printable characters
    const containsOnlyPrintableCharacters = (str: string): boolean => {
      return /^[\x20-\x7E]*$/.test(str);
    };

    const sanitizeJSONString = (jsonString: string): string => {
      // Remove null characters
      let sanitizedString = jsonString.replace(/\\u0000/g, "");
      // Escape backslashes
      sanitizedString = sanitizedString.replace(/\\/g, "\\\\");
      // Ensure valid Unicode escapes
      sanitizedString = sanitizedString.replace(/\\u([0-9A-Fa-f]{4})/g, "\\u$1");

      return sanitizedString;
    };

    const recursiveSanitize = (obj: any): any => {
      if (obj === null || obj === undefined) {
        return obj;
      }

      if (typeof obj === "string") {
        // If the string contains non-printable characters, replace it with the replacement string
        if (!containsOnlyPrintableCharacters(obj)) {
          return replacementString;
        }
        // Otherwise, sanitize the string
        return sanitizeJSONString(obj);
      }

      if (typeof obj === "object") {
        const newObj: any = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = recursiveSanitize(obj[key]);
          }
        }
        return newObj;
      }

      return obj;
    };

    // const sanitizedLdapObject = recursiveSanitize(sanitizedLdapUser);
    const sanitizedLdapObject = recursiveSanitize(sanitizedLdapUser);

    this.LDAPObject = JSON.stringify(sanitizedLdapObject);
    return this;
  }

  public build(info: UserInformation, fromLDAP: ILdapUser = null) {
    this.position = info.position;
    this.department = info.department;
    this.decisionMaker = info.decisionMaker;
    if (fromLDAP) this.sanitizeAndAssignLDAPObject(fromLDAP);

    return this;
  }
}
