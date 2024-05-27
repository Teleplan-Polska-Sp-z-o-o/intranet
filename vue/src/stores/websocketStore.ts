import { defineStore } from "pinia";
// import { ComputedRef, computed, ref, watch } from "vue";
import { ref, watch } from "vue";
import { WebsocketConnections } from "../models/common/WebsocketConnections";
// import { ENotificationSource } from "../interfaces/user/notification/ENotificationSource";
// import { INotificationEntity } from "../interfaces/user/notification/INotificationEntity";
// import { UserNotification } from "../models/common/notification/UserNotification";

let intervalInitialized = false;

export const useWebsocketStore = defineStore("websocket", () => {
  const receivedMessages = ref<Array<MessageEvent<any>>>([]);

  const instance = ref<WebSocket>(WebsocketConnections.getInstance());

  const instanceReadyState = ref<number>(instance.value.readyState);

  const checkOnMessage = () => {
    if (instance.value.onmessage === null) {
      instance.value.onmessage = async (event: MessageEvent<any>) => {
        console.log(event);
        receivedMessages.value.push(event);
      };
    }
  };

  checkOnMessage();

  const indicateWebSocketClosureState = (readyState: number) => {
    instanceReadyState.value = readyState;
  };

  watch(instanceReadyState, (newValue) => {
    if (newValue === 2 || newValue === 3) {
      try {
        instance.value = WebsocketConnections.getInstance();
        console.error(`WebSocketStore was able to reconnect`);
      } catch (error) {
        console.error(`WebSocketStore was unable to reconnect: ${error}`);
      }
    }
  });

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
    if (!intervalInitialized) {
      intervalInitialized = true;
      setInterval(() => {
        checkConnection();
      }, 60000);
    }
  };

  initializeInterval();

  // const getNotificationBySource = (
  //   source: ENotificationSource
  // ): ComputedRef<Array<UserNotification>> => {
  //   return computed<Array<UserNotification>>(() => {
  //     const data = receivedMessages.value.map(
  //       (messageEvent: MessageEvent<any>) => messageEvent.data
  //     );

  //     const notifications: Array<UserNotification> = data.map(
  //       (notificationEntityJSON: string): UserNotification => {
  //         const notificationEntity: INotificationEntity = JSON.parse(notificationEntityJSON);
  //         return new UserNotification(notificationEntity);
  //       }
  //     );

  //     const filteredBySource: Array<UserNotification> = notifications.filter(
  //       (notification) => notification.source === source
  //     );

  //     return filteredBySource;
  //   });
  // };

  return { receivedMessages, indicateWebSocketClosureState };
});
