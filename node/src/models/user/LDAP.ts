import { authenticate } from "ldap-authentication";
import { ILogin } from "../../interfaces/user/ILogin";
import { getLDAPConfig } from "../../config/ldap";
import { serverConfig } from "../../config/server";
import { JwtPayload, Secret, SignOptions, sign, verify } from "jsonwebtoken";

class LDAP {
  username: string;
  domain: string;
  private password: string;

  private DEFAULT_OPTIONS: SignOptions = {
    expiresIn: "1h",
  } as const;

  constructor(login?: ILogin) {
    this.username = login?.username || "";
    this.domain = login?.domain || "";
    this.password = login?.password || "";
  }

  public authenticate = async (loginObj?: ILogin): Promise<any> => {
    try {
      if (loginObj) {
        this.username = loginObj.username;
        this.domain = loginObj.domain;
        this.password = loginObj.password;
      } else if (!this.username || !this.domain || !this.password) {
        throw new Error(
          `LDAP object expects user credentials. None has been provided in constructor, 'authenticate' at this point requires providing user credentials.`
        );
      }

      const fromLogin: ILogin = {
        username: this.username,
        domain: this.domain,
        password: this.password,
      };

      const options = getLDAPConfig(fromLogin);

      return authenticate(options);
    } catch (error) {
      throw new Error(`authenticate at LDAP, ${error}`);
    }
  };

  public generateJwt = (
    payload: string | Buffer | object,
    overrideOptions?: SignOptions & { secret: string }
  ): string => {
    try {
      const secretKey: Secret = serverConfig.apiKey;

      if (overrideOptions && overrideOptions.secret !== secretKey) {
        throw new Error(`overrideOptions require secret key`);
      } else if (overrideOptions && overrideOptions.secret === secretKey)
        delete overrideOptions.secret;

      const options: SignOptions = this.DEFAULT_OPTIONS;
      const token: string = sign(payload, secretKey, overrideOptions ? overrideOptions : options);
      return token;
    } catch (error) {
      console.log(`generateJwt at LDAP, ${error}`);
    }
  };

  private isJson = (input: string | Buffer | object): boolean => {
    try {
      if (typeof input !== "string") return false;
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  public verifyJwt = (jwtToken: string): JwtPayload | false => {
    try {
      const token: string = this.isJson(jwtToken) ? JSON.parse(jwtToken) : jwtToken;
      const secretKey: Secret = serverConfig.apiKey;

      const decoded: JwtPayload = verify(token, secretKey) as JwtPayload;

      return decoded; // payload
    } catch (error) {
      return false; // unverified
    }
  };

  public refreshJwt = (jwtToken: JwtPayload | string): string => {
    // based on example: https://gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48

    try {
      const payload: JwtPayload | false =
        typeof jwtToken !== "string" ? jwtToken : this.verifyJwt(jwtToken);

      if (!payload) throw new Error(`refreshJwt at LDAP`);

      if (payload.aud) delete payload.aud;
      if (payload.exp) delete payload.exp;
      if (payload.iat) delete payload.iat;
      if (payload.iss) delete payload.iss;
      if (payload.jti) delete payload.jti;
      if (payload.nbf) delete payload.nbf;
      if (payload.sub) delete payload.sub;

      const secretKey: Secret = serverConfig.apiKey;
      const options: SignOptions & { secret: string } = Object.assign(
        { secret: secretKey },
        this.DEFAULT_OPTIONS
      );

      const token: string = this.generateJwt(payload, options);
      return token;
    } catch (error) {
      console.log(error);
    }
  };
}

export { LDAP };
