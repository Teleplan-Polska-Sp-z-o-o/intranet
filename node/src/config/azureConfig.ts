import * as dotenv from "dotenv";
import { IAzureConfig } from "../interfaces/config/IAzureConfig";

dotenv.config({ path: "./.env" });
const azureConfig: IAzureConfig = {
  clientId: process.env.AZURE_APP_CLIENT_ID,
  tenantId: process.env.AZURE_APP_TENANT_ID,
};

export { azureConfig };
