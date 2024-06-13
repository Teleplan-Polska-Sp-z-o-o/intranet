type TAssistantResponseChunk = {
  type?: string;
  data?: string;
  references?: string;
  finished?: string;
  message?: string;
};

type TAssistantResponseMessage = {
  [key: string]: Array<TAssistantResponseChunk>;
};

type TAssistantResponseMessages = Array<TAssistantResponseMessage>;

type TAssistantResponseConversations = {
  [key: string]: TAssistantResponseMessages;
};

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
  TAssistantResponseConversations,
  ICreateConversation,
};
