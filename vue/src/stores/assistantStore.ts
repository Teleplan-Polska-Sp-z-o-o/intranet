import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  TAssistantResponseChunk,
  TAssistantResponseMessage,
  TAssistantResponseMessages,
} from "../interfaces/assistants/AssistantResponse";

export const useAssistantStore = defineStore("assistant", () => {
  const messages = ref<TAssistantResponseMessages>([]);
  const storedMessages = computed(() => messages.value);
  const message = ref<TAssistantResponseMessage>([]);
  const storedMessage = computed(() => message.value);

  const storeChunk = (chunk: TAssistantResponseChunk) => {
    if (Object.keys(chunk).length > 0) {
      if (chunk?.type !== "finished") message.value.push(chunk);
      if (chunk?.type === "finished" || Object.hasOwn(chunk, "message")) {
        messages.value.push(message.value);
        message.value = [];
      }
    }
  };

  const clearStoredMessages = (): TAssistantResponseMessages => {
    messages.value = [];
    return storedMessages.value;
  };
  return { storeChunk, storedMessage, storedMessages, clearStoredMessages };
});
