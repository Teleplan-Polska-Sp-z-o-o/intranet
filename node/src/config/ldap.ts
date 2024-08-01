import { AuthenticationOptions } from "ldap-authentication";
import { ILogin } from "../interfaces/user/UserTypes";

const getLDAPConfig = (loginData: ILogin): AuthenticationOptions => {
  if (!loginData.username || !loginData.domain || !loginData.password) {
    throw new Error("Login data must include username, domain, and password.");
  }

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
