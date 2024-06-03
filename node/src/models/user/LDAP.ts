import { authenticate } from "ldap-authentication";
import { ILogin } from "../../interfaces/user/ILogin";
import { getLDAPConfig } from "../../config/ldap";

class LDAP implements ILogin {
  username: string;
  domain: string;
  password: string;

  constructor(login: ILogin) {
    this.username = login.username;
    this.domain = login.domain;
    this.password = login.password;
  }

  public authentication = async (): Promise<any> => {
    // const ldapHost = `ldap://${this.domain}`;
    // const options = {
    //   ldapOpts: { url: ldapHost },
    //   userDn: `${this.username}@${this.domain}`,
    //   userPassword: this.password,
    // };

    const fromLogin: ILogin = {
      username: this.username,
      domain: this.domain,
      password: this.password,
    };
    const options = getLDAPConfig(fromLogin);

    return authenticate(options);
  };
}

export { LDAP };
