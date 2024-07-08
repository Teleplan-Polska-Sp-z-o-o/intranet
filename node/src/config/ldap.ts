import { AuthenticationOptions } from "ldap-authentication";
import { ILogin } from "../interfaces/user/UserTypes";
// import * as dotenv from "dotenv";

// dotenv.config({ path: "./.env" });

const getLDAPConfig = (loginData: ILogin): AuthenticationOptions => {
  // const intranetUser = {
  //   username: process.env.INTRANET_USER,
  //   password: process.env.INTRANET_PASSWORD,
  // };

  if (!loginData.username || !loginData.domain || !loginData.password) {
    throw new Error("Login data must include username, domain, and password.");
  }

  // if (!intranetUser.username || !intranetUser.password) {
  //   throw new Error("Intranet user credentials must be set in environment variables.");
  // }

  const getUserSearchBase = (): string => {
    switch (loginData.domain) {
      case "reconext.com":
        return `dc=reconext,dc=com`;
      case "tgn.teleplan.com":
        return `dc=tgn,dc=teleplan,dc=com`;
      default:
        throw new Error(`Domain doesn't match any switch cases.`);
    }
  };
  // const x = ["cn", "title", "department", "company"];

  const ldapHost = `ldap://${loginData.domain}`;
  const userDn = `${loginData.username}@${loginData.domain}`;

  const ldapConfig: AuthenticationOptions = {
    ldapOpts: { url: ldapHost },
    // adminDn: `${intranetUser.username}@${loginData.domain}`,
    // adminPassword: intranetUser.password,
    userDn: userDn,
    //
    userPassword: loginData.password,
    userSearchBase: getUserSearchBase(),
    usernameAttribute: `sAMAccountName`,
    username: loginData.username,
  };

  return ldapConfig;
};

export { getLDAPConfig };
