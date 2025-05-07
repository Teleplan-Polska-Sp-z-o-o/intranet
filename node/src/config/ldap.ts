import { AuthenticationOptions } from "ldap-authentication";
import { ILogin } from "../interfaces/user/UserTypes";

const allowedDomains: Record<string, string> = {
  "reconext.com": "dc=reconext,dc=com",
  "tgn.teleplan.com": "dc=tgn,dc=teleplan,dc=com",
};
export const ldapBaseDNs = allowedDomains;

export const USER_REQUIRED_GROUP = "byd-intranet-useraccess";

const getLDAPConfig = (loginData: ILogin): AuthenticationOptions => {
  // if (!loginData.username || !loginData.domain || !loginData.password) {
  //   throw new Error("Login data must include username, domain, and password.");
  // }

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

  // const allowedDomains = ["reconext.com", "tgn.teleplan.com"];

  // if (!allowedDomains.includes(loginData.domain)) {
  //   throw new Error(`Access denied: domain '${loginData.domain}' is not allowed.`);
  // }

  const { username, domain, password } = loginData;

  if (!username || !domain || !password) {
    throw new Error("Login data must include username, domain, and password.");
  }

  const searchBase = allowedDomains[domain];

  if (!searchBase) {
    throw new Error(`Access denied: domain '${domain}' is not allowed.`);
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
    userSearchBase: searchBase,
    usernameAttribute: "sAMAccountName",
    username: username,
  };

  return ldapConfig;
};

export { getLDAPConfig };
