import { authenticate } from "ldap-authentication";
import { ILogin } from "../../interfaces/user/ILogin";

class User implements ILogin {
  username: string;
  domain: string;
  password: string;

  constructor(login: ILogin) {
    this.username = login.username;
    this.domain = login.domain;
    this.password = login.password;
  }

  public ldapAuthenticate = async (): Promise<any> => {
    const ldapHost = `ldap://${this.domain}`;
    const options = {
      ldapOpts: { url: ldapHost },
      userDn: `${this.username}@${this.domain}`,
      userPassword: this.password,
    };

    return authenticate(options);
  };
}

export { User };
