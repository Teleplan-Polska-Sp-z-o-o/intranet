interface IEmailOptions {
  to: string;
  cc?: string | string[];
  subject: string;
  html: string;
}

export { IEmailOptions };
