import * as dotenv from "dotenv";
import { IEmailConfig } from "../interfaces/config/IEmailConfig";

dotenv.config({ path: "./.env" });

const emailConfig: IEmailConfig = {
  host: process.env.EMAIL_SERVICE,
  port: parseInt(process.env.EMAIL_PORT),
  secure: parseInt(process.env.EMAIL_PORT) !== 587,
  auth: {
    user: `${process.env.EMAIL_USER}@${process.env.EMAIL_DOMAIN}`,
    pass: process.env.EMAIL_PASSWORD,
  },
  domain: process.env.EMAIL_DOMAIN,
};

export { emailConfig };
