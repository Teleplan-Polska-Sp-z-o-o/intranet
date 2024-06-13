import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  TAssistantResponseChunk,
  TAssistantResponseConversations,
  TAssistantResponseMessage,
  TAssistantResponseMessages,
} from "../interfaces/assistants/TAssistantResponse";

export const useAssistantStore = defineStore("assistant", () => {
  const conversations = ref<TAssistantResponseConversations>({});
  const storedConversations = computed(() => conversations.value);
  const message = ref<TAssistantResponseMessage>({});
  const storedMessage = computed(() => message.value);

  const _storeMessageInConversations = (
    message: TAssistantResponseMessage,
    conversationKey: string
  ): void => {
    try {
      if (!Object.hasOwn(conversations.value, conversationKey)) {
        conversations.value[conversationKey] = [];
      }

      conversations.value[conversationKey].push({ [conversationKey]: message[conversationKey] });
    } catch (error) {
      console.error(`_storeMessageInConversations at useAssistantStore: ${error}`);
    }
  };
  const _storeChunk = (chunk: TAssistantResponseChunk, conversationKey: string): void => {
    try {
      if (!Object.hasOwn(message.value, conversationKey)) {
        message.value[conversationKey] = [];
      }
      if (chunk?.type !== "finished") message.value[conversationKey].push(chunk);
      if (chunk?.type === "finished" || Object.hasOwn(chunk, "message")) {
        _storeMessageInConversations(message.value, conversationKey);
        delete message.value[conversationKey];
      }
    } catch (error) {
      console.error(`_storeChunk at useAssistantStore: ${error}`);
    }
  };

  const store = (chunk: TAssistantResponseChunk, conversationKey: string): void => {
    try {
      if (Object.keys(chunk).length > 0) {
        _storeChunk(chunk, conversationKey);
      }
    } catch (error) {
      console.error(`store at save: ${error}`);
    }
  };

  const clearStoredMessagesInConversation = (
    conversationKey: string,
    deleteConversationKey?: boolean
  ): TAssistantResponseMessages => {
    try {
      if (Object.hasOwn(conversations.value, conversationKey)) {
        if (deleteConversationKey) delete conversations.value[conversationKey];
        else conversations.value[conversationKey] = [];
      }
    } catch (error) {
      console.error(`clearStoredMessagesInConversation at useAssistantStore: ${error}`);
    } finally {
      return storedConversations.value[conversationKey];
    }
  };

  return { store, storedMessage, storedConversations, clearStoredMessagesInConversation };
});
