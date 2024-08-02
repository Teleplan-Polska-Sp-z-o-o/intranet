// import { useRouter } from "vue-router";
// import { useUserStore } from "../../stores/userStore";
import { nodeConfig } from "../../config/env";
import { useAssistantStore } from "../../stores/assistantStore";
import { ICreateConversation } from "../../interfaces/assistants/TAssistantResponse";
import jwtAxios from "../../config/axios/jwtAxios";

class AiAssistant {
  // config
  private static stream: boolean = false;
  private static domain: string = nodeConfig.origin as string;
  private static createEndpoint: string = `https://global.repengineering.io/ai/api/v1/conversations`;

  private conversationKey: string = "";
  // private token: string | null = null; // jwt token, created by constructor
  private headers: { headers: Record<string, string> }; // created by constructor
  private id: string = ""; // created by createConversation
  private questionEndpoint: string | null = null; // created by createConversation

  constructor(conversationKey: string) {
    this.conversationKey = conversationKey;

    // token
    // const token = useUserStore().getToken();
    // if (token) this.token = token;
    // else useRouter().push({ path: `/` });
    //

    this.headers = {
      headers: {
        "X-Request-Origin": AiAssistant.domain,
        Accept: "application/json",
      },
    };
  }

  public createConversation = async (newConversation: boolean): Promise<AiAssistant> => {
    let instance: AiAssistant | null = null;
    if (newConversation) {
      useAssistantStore().clearStoredMessagesInConversation(this.conversationKey);
      instance = new AiAssistant(this.conversationKey);
    }

    const response: ICreateConversation = await jwtAxios.post(
      AiAssistant.createEndpoint,
      undefined,
      instance ? instance.headers : this.headers
    );

    const generateQuestionEndpoint = (id: string): string =>
      `https://global.repengineering.io/ai/api/v1/conversations/${id}/messages?stream=${AiAssistant.stream}`;
    if (instance) {
      instance.id = response.data._id;
      instance.questionEndpoint = generateQuestionEndpoint(instance.id);
    } else {
      this.id = response.data._id;
      this.questionEndpoint = generateQuestionEndpoint(this.id);
    }

    return instance || this;
  };

  public question = async (input: string) => {
    try {
      if (!this.questionEndpoint) {
        throw new Error(`In order to ask question initiate conversation.`);
      }

      const payload: { message: string } = {
        message: input,
      };

      useAssistantStore().store(payload, this.conversationKey);

      const response: any = await jwtAxios.post(this.questionEndpoint, payload, this.headers);

      const chunksToParseAndSubstring = response.data.split("\n\n").filter(Boolean);
      const chunksToParse = chunksToParseAndSubstring.map((data: string) => data.substring(6));
      const chunksParsed = chunksToParse.map((data: string) => JSON.parse(data));

      for (const chunk of chunksParsed) {
        useAssistantStore().store(chunk, this.conversationKey);
      }
    } catch (error) {
      console.error("Error in jwtAxios request:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };
}

export { AiAssistant };
