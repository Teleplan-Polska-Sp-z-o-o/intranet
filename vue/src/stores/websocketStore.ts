import { defineStore } from "pinia";
// import { ComputedRef, computed, ref, watch } from "vue";
import { ref, watch } from "vue";
import { WebsocketConnections } from "../models/common/WebsocketConnections";
import { useUserStore } from "./userStore";
import { useRouter } from "vue-router";
// import { ENotificationSource } from "../interfaces/user/notification/ENotificationSource";
// import { INotificationEntity } from "../interfaces/user/notification/INotificationEntity";
// import { UserNotification } from "../models/common/notification/UserNotification";

export const useWebsocketStore = defineStore("websocket", () => {
  const receivedMessages = ref<Array<MessageEvent<any>>>([]);

  const openConnection = () => {
    if (!instance.value) instance.value = WebsocketConnections.getInstance();
  };

  const instance = ref<WebSocket | undefined>(undefined);

  // const instanceReadyState = ref<number>(instance.value.readyState);

  const checkOnMessage = () => {
    if (instance.value && instance.value.onmessage === null) {
      instance.value.onmessage = async (event: MessageEvent<any>) => {
        receivedMessages.value.push(event);
      };
    }
  };

  watch(
    () => instance.value,
    () => {
      checkOnMessage();
    },
    { deep: true }
  );

  const indicateWebSocketClosureState = (_readyState: number) => {
    // instanceReadyState.value = readyState;
  };

  const closeConnection = () => {
    if (instance.value && instance.value.readyState !== 3) {
      instance.value.close();
      instance.value = undefined;
    }
  };

  const checkConnection = () => {
    if (!instance.value || instance.value.readyState === 2 || instance.value.readyState === 3) {
      try {
        instance.value = WebsocketConnections.getInstance();
        checkOnMessage();
      } catch (error) {
        console.error(`WebSocketStore failed to reconnect: ${error}`);
      }
    }
  };

  const initializeInterval = () => {
    setInterval(() => {
      useUserStore()
        .verifyToken()
        .then((isVerified: boolean) => {
          if (isVerified) {
            checkConnection();
          } else closeConnection();
        })
        .catch((error: any) => {
          if (error.response && error.response.status === 401) {
            useRouter().push("/");
          }
          console.error("Token verification failed with error:", error.message || error);
        });
    }, 300000);
  };

  initializeInterval();

  return { openConnection, receivedMessages, indicateWebSocketClosureState, closeConnection };
});
