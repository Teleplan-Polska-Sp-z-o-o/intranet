import jwt, { JwtHeader, SigningKeyCallback } from "jsonwebtoken";
import jwksClient, { JwksClient } from "jwks-rsa";
import { azureConfig } from "../../config/azureConfig";

class MicrosoftTokenVerifier {
  private tenantId: string;
  private clientId: string;
  private jwksClient: JwksClient;

  constructor() {
    this.tenantId = azureConfig.tenantId;
    this.clientId = azureConfig.clientId;

    this.jwksClient = jwksClient({
      jwksUri: `https://login.microsoftonline.com/${this.tenantId}/discovery/v2.0/keys`,
    });
  }

  private getKey(header: JwtHeader, callback: SigningKeyCallback): void {
    this.jwksClient.getSigningKey(header.kid as string, (err, key) => {
      if (err) return callback(err);
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    });
  }

  public async verifyToken(idToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        idToken,
        this.getKey.bind(this),
        {
          algorithms: ["RS256"],
          audience: this.clientId,
          issuer: `https://login.microsoftonline.com/${this.tenantId}/v2.0`,
        },
        (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        }
      );
    });
  }
}

export { MicrosoftTokenVerifier };
