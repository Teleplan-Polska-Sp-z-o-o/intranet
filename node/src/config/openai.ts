import * as dotenv from "dotenv";

dotenv.config({ path: "./.env" });

interface IOpenAiConfig {
  api_key_test: string;
  api_key: null;
}

const openAiConfig: IOpenAiConfig = {
  api_key_test: process.env.OPENAI_API_KEY_TEST,
  api_key: null,
};

export { openAiConfig };
