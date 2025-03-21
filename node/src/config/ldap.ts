import { AuthenticationOptions } from "ldap-authentication";
import { ILogin } from "../interfaces/user/UserTypes";

const getLDAPConfig = (loginData: ILogin): AuthenticationOptions => {
  if (!loginData.username || !loginData.domain || !loginData.password) {
    throw new Error("Login data must include username, domain, and password.");
  }

  // const getUserSearchBase = (): string => {
  //   switch (loginData.domain) {
  //     case "reconext.com":
  //       return `dc=reconext,dc=com`;
  //     case "tgn.teleplan.com":
  //       return `dc=tgn,dc=teleplan,dc=com`;
  //     default:
  //       throw new Error(`Domain doesn't match any switch cases.`);
  //   }
  // };

  const allowedDomains = ["reconext.com", "tgn.teleplan.com"];

  if (!allowedDomains.includes(loginData.domain)) {
    throw new Error(`Access denied: domain '${loginData.domain}' is not allowed.`);
  }

  const ldapHost = `ldap://${loginData.domain}`;
  const userDn = `${loginData.username}@${loginData.domain}`;

  const ldapConfig: AuthenticationOptions = {
    ldapOpts: { url: ldapHost },
    userDn: userDn,
    userPassword: loginData.password,
    // userSearchBase: getUserSearchBase(),
    // usernameAttribute: `sAMAccountName`,
    // username: loginData.username,
  };

  return ldapConfig;
};

export { getLDAPConfig };
