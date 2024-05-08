interface IEmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: { user: string; pass: string };
  domain: string;
}

export { IEmailConfig };
