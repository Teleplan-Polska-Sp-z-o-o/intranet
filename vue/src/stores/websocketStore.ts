import { defineStore } from "pinia";
import { ref } from "vue";
import { nodeConfig } from "../config/env";

export const useWebsocketStore = defineStore("websocket", () => {
  const translateOrigin = (v: string | undefined): string => {
    if (typeof v === "string") {
      return v.replace("http", "ws");
    }
    throw new Error("Origin resolves to undefined");
  };

  const socket = ref<WebSocket | null>(null);

  const initSocket = (): void => {
    if (!socket.value)
      socket.value = new WebSocket(`${translateOrigin(nodeConfig.origin)}:${nodeConfig.port}/`);
  };

  const getSocket = (): WebSocket | null => socket.value;

  return { getSocket, initSocket };
});
