import { AuthenticationOptions } from "ldap-authentication";
import { ILogin } from "../interfaces/user/ILogin";
import * as dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const getLDAPConfig = (loginData: ILogin): AuthenticationOptions => {
  const intranetUser = {
    username: process.env.INTRANET_USER,
    password: process.env.INTRANET_PASSWORD,
  };

  if (!loginData.username || !loginData.domain || !loginData.password) {
    throw new Error("Login data must include username, domain, and password.");
  }

  if (!intranetUser.username || !intranetUser.password) {
    throw new Error("Intranet user credentials must be set in environment variables.");
  }

  const ldapHost = `ldap://${loginData.domain}`;

  const ldapConfig: AuthenticationOptions = {
    ldapOpts: { url: ldapHost },
    adminDn: `${intranetUser.username}@reconext.com`,
    adminPassword: intranetUser.password,
    //
    userSearchBase: `dc=reconext,dc=com`,
    usernameAttribute: `sAMAccountName`,
    username: loginData.username,
    userPassword: loginData.password,
  };

  return ldapConfig;
};

export { getLDAPConfig };
