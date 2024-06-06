import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";
import axios from "axios";
import { nodeConfig } from "../../config/env";

class DocumentAssistant {
  // jwt token
  private token: string | null = null;

  // config
  private headers: {
    headers: {
      [key: string]: string;
    };
  };
  private stream: boolean = false;

  // object returned by create conversation
  private id: string = "";
  private createdAt: string = "";
  private messages: Array<{
    [key: string]: string;
  }> = [];

  private endpoint: { create: string; question: string };

  constructor() {
    // token
    const userStore = useUserStore();
    const token = userStore.getToken();
    if (token) this.token = token;
    else useRouter().push({ path: `/` });
    //
    this.endpoint = {
      create: `https: global.repengineering.io/ai/api/v1/conversations`,
      question: `https: global.repengineering.io/ai/api/v1/conversations/${this.id}/messages?stream=${this.stream}`,
    };

    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "X-Request-Origin": nodeConfig.origin as string,
        Authorization: `Bearer "${this.token}"`,
      },
    };
  }

  public createConversation = async (): Promise<DocumentAssistant> => {
    const response: {
      id: string;
      createdAt: string;
      messages: Array<{
        [key: string]: string;
      }>;
    } = await axios.post(this.endpoint.create, null, this.headers);

    this.id = response.id;
    this.createdAt = response.createdAt;
    this.messages = response.messages;

    // to test
    [this.createdAt, this.messages];

    return this;
  };
}

export { DocumentAssistant };
