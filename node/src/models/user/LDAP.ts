import { authenticate } from "ldap-authentication";
import { ILogin, IUser } from "../../interfaces/user/UserTypes";
import { getLDAPConfig } from "../../config/ldap";
import { serverConfig } from "../../config/server";
import { JwtPayload, Secret, SignOptions, sign, verify } from "jsonwebtoken";
import { User } from "../../orm/entity/user/UserEntity";

class LDAP {
  username: string;
  domain: string;
  private password: string;

  private DEFAULT_OPTIONS: SignOptions = {
    expiresIn: "1h",
  } as const;

  constructor(login?: ILogin) {
    this.username = login?.username.toLocaleLowerCase() || "";
    this.domain = login?.domain || "";
    this.password = login?.password || "";
  }

  private isUser(payload: string | Buffer | object): payload is User {
    return (
      typeof payload === "object" &&
      payload !== null &&
      "id" in payload &&
      "username" in payload &&
      "domain" in payload
    );
  }

  public passport(user: object) {
    if (!this.isUser(user)) {
      throw new Error(`passport function at LDAP expects User object from database.`);
    }

    return { id: user.id, username: user.username, domain: user.domain };
  }

  public auth = async (loginObj?: ILogin): Promise<this> => {
    if (loginObj) {
      this.username = loginObj.username;
      this.domain = loginObj.domain;
      this.password = loginObj.password;
    } else if (!this.username || !this.domain || !this.password) {
      throw new Error(
        `LDAP object expects user credentials. None has been provided in constructor, 'auth' at this point requires providing user credentials.`
      );
    }

    const fromLogin: ILogin = {
      username: this.username,
      domain: this.domain,
      password: this.password,
    };

    const options = getLDAPConfig(fromLogin);

    await authenticate(options);

    return this;
  };

  public generateJwt = (
    payload: string | Buffer | object,
    overrideOptions?: SignOptions & { secret: string }
  ): string => {
    try {
      // Validate if payload is a User object
      if (this.isUser(payload)) {
        payload = { ...payload }; // Ensure it's treated as an object
      } else {
        throw new Error("Payload must be a User object, a string, or a Buffer");
      }

      const secretKey: Secret = serverConfig.apiKey;

      if (overrideOptions && overrideOptions.secret !== secretKey) {
        throw new Error(`overrideOptions require secret key`);
      } else if (overrideOptions && overrideOptions.secret === secretKey)
        delete overrideOptions.secret;

      const options: SignOptions = this.DEFAULT_OPTIONS;
      const token: string = sign(
        this.passport(payload),
        secretKey,
        overrideOptions ? overrideOptions : options
      );
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
