import * as dotenv from "dotenv";
import { IServerConfig } from "../interfaces/config/IServerConfig";

dotenv.config({ path: "./.env" });

const serverConfig: IServerConfig = {
  test: process.env.TEST === "true" ? true : false,
  host: process.env.HOST,
  origin: process.env.ORIGIN,
  production_origin: process.env.PRODUCTION_ORIGIN,
  port: parseInt(process.env.NODE_PORT),
  apiKey: process.env.NODE_API_KEY,
};

export { serverConfig };
