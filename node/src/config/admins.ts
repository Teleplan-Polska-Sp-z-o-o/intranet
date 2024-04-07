import * as dotenv from "dotenv";
import { IAdminsConfig } from "../interfaces/config/IAdminsConfig";

dotenv.config({ path: "./.env" });

const adminsConfig: IAdminsConfig = {
  admins: process.env.ADMINS.split(" "),
};

export { adminsConfig };
