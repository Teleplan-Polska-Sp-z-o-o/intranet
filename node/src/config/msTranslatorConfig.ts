import * as dotenv from "dotenv";
import { IMSTranslatorConfig } from "../interfaces/config/IMSTranslatorConfig";

dotenv.config({ path: "./.env" });

const msTranslatorConfig: IMSTranslatorConfig = {
  apiKey: process.env.MS_TRANSLATOR_API_KEY,
  baseEndpoint: process.env.MS_TRANSLATOR_BASE_ENDPOINT,
  version: process.env.MS_TRANSLATOR_VERSION,
};

export { msTranslatorConfig };
