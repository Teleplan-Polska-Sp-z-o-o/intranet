import { useUserStore } from "../stores/userStore";

interface ServerConfig {
  origin: string;
  port: number;
}

const TEST_ORIGIN = "http://192.168.0.1";
const ORIGIN = "https://bydintranet.reconext.com";

const nodeConfig: ServerConfig = {
  origin: window.location.origin,
  port: 3000,
};

if (![TEST_ORIGIN, ORIGIN].includes(nodeConfig.origin)) {
  throw new Error(
    `Invalid nodeConfig origin at env.ts. [TEST_ORIGIN, ORIGIN] doesn't include result of window.location.origin (${nodeConfig.origin})`
  );
}

interface AssistantConfig {
  url: string;
  token: string;
}

const DOCUMENT_ASSISTANT_TEST = true;
const DOCUMENT_ASSISTANT_URL = "";

const getDocumentsAssistantConfig = (): AssistantConfig => {
  const userStore = useUserStore();
  const assistantToken: string | false = userStore.getToken();

  if (!assistantToken) console.error(`assistantToken at env.ts evaluates to ${assistantToken}`);

  const documentsAssistantConfig: AssistantConfig = {
    url: DOCUMENT_ASSISTANT_TEST
      ? "https://fr.wikipedia.org/wiki/Main_Page"
      : DOCUMENT_ASSISTANT_URL,
    token: assistantToken.toString(),
  };

  return documentsAssistantConfig;
};

export { nodeConfig, getDocumentsAssistantConfig };
