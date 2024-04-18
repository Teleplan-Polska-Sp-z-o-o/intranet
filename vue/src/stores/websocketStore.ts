import { defineStore } from "pinia";
import { ComputedRef, computed, ref, watch } from "vue";
import { WebsocketConnections } from "../models/common/WebsocketConnections";
import { ENotificationSource } from "../interfaces/user/notification/ENotificationSource";
import { INotificationEntity } from "../interfaces/user/notification/INotificationEntity";
import { UserNotification } from "../models/common/notification/UserNotification";

export const useWebsocketStore = defineStore("websocket", () => {
  const receivedMessages = ref<Array<MessageEvent<any>>>([]);

  const instance = ref<WebSocket>(WebsocketConnections.getInstance());

  const instanceReadyState = ref<number>(instance.value.readyState);

  if (instance.value.onmessage === null) {
    instance.value.onmessage = async (event: MessageEvent<any>) => {
      receivedMessages.value.push(event);
    };
  }

  const indicateWebSocketClosureState = (readyState: number) => {
    instanceReadyState.value = readyState;
  };

  watch(instanceReadyState, (newValue) => {
    if (newValue === WebSocket.CLOSED) {
      try {
        instance.value = WebsocketConnections.getInstance();
      } catch (error) {
        console.error(`WebSocketStore was unable to reconnect: ${error}`);
      }
    }
  });

  const getNotificationBySource = (
    source: ENotificationSource
  ): ComputedRef<Array<UserNotification>> => {
    return computed<Array<UserNotification>>(() => {
      const data = receivedMessages.value.map(
        (messageEvent: MessageEvent<any>) => messageEvent.data
      );

      const notifications: Array<UserNotification> = data.map(
        (notificationEntityJSON: string): UserNotification => {
          const notificationEntity: INotificationEntity = JSON.parse(notificationEntityJSON);
          return new UserNotification(notificationEntity);
        }
      );

      const filteredBySource: Array<UserNotification> = notifications.filter(
        (notification) => notification.source === source
      );

      return filteredBySource;
    });
  };

  return { receivedMessages, getNotificationBySource, indicateWebSocketClosureState };
});
