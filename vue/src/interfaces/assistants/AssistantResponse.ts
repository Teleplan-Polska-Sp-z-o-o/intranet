type TAssistantResponseChunk = {
  [key: string]: string | undefined;
  type?: string;
  data?: string;
  references?: string;
  finished?: string;
  message?: string;
};

type TAssistantResponseMessage = Array<TAssistantResponseChunk>;

type TAssistantResponseMessages = Array<TAssistantResponseMessage>;

type ICreateConversation = {
  data: {
    _id: string;
    createdAt: number;
    messages: any;
  };
};

export type {
  TAssistantResponseChunk,
  TAssistantResponseMessage,
  TAssistantResponseMessages,
  ICreateConversation,
};
