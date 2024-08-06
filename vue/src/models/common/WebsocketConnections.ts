import { nodeConfig } from "../../config/env";
import { IUserEntity } from "../../interfaces/user/IUserEntity";
import { useUserStore } from "../../stores/userStore";
import { useWebsocketStore } from "../../stores/websocketStore";
import { SimpleUser } from "../user/SimpleUser";

class WebsocketConnections {
  private static instance: WebSocket;

  private constructor() {}

  public static getInstance(): WebSocket {
    if (!WebsocketConnections.instance || WebsocketConnections.instance.readyState === 3) {
      const user: IUserEntity | false = useUserStore().info();
      if (user) {
        WebsocketConnections.instance = new WebSocket(
          `${nodeConfig.origin?.replace("http", "ws")}:${nodeConfig.port}/ws`
        );
        WebsocketConnections.instance.onopen = () => {
          console.log(`WebSocket connection established.`);
          WebsocketConnections.instance.send(
            JSON.stringify({ user: new SimpleUser().build(user) })
          );
        };

        WebsocketConnections.instance.onerror = () => {
          console.error(`WebSocket connection error.`);

          const webSocketStore = useWebsocketStore();
          webSocketStore.indicateWebSocketClosureState(WebsocketConnections.instance.readyState);
        };

        WebsocketConnections.instance.onclose = () => {
          console.warn(`WebSocket connection closing.`);
          const webSocketStore = useWebsocketStore();
          webSocketStore.indicateWebSocketClosureState(WebsocketConnections.instance.readyState);
        };
      } else throw new Error(`User at WebsocketConnections evaluates to false, can't instantiate.`);
    }
    return WebsocketConnections.instance;
  }
}

export { WebsocketConnections };
