import { nodeConfig } from "../../config/env";
import { IUser } from "../../interfaces/user/IUser";
import { useUserStore } from "../../stores/userStore";
import { useWebsocketStore } from "../../stores/websocketStore";

class WebsocketConnections {
  private static instance: WebSocket;

  private constructor() {}

  public static getInstance(): WebSocket {
    if (
      !WebsocketConnections.instance ||
      WebsocketConnections.instance.readyState === WebSocket.CLOSED
    ) {
      const user: IUser | false = useUserStore().info();
      if (user) {
        WebsocketConnections.instance = new WebSocket(
          `${nodeConfig.origin?.replace("http", "ws")}:${nodeConfig.port}/`
        );
        WebsocketConnections.instance.onopen = () => {
          WebsocketConnections.instance.send(JSON.stringify({ user }));
        };

        WebsocketConnections.instance.onerror = (error) => {
          console.error("WebSocket onerror:", error);
          const webSocketStore = useWebsocketStore();
          webSocketStore.indicateWebSocketClosureState(WebsocketConnections.instance.readyState);
        };

        WebsocketConnections.instance.onclose = () => {
          const webSocketStore = useWebsocketStore();
          webSocketStore.indicateWebSocketClosureState(WebsocketConnections.instance.readyState);
        };
      } else throw new Error(`User at WebsocketConnections evaluates to false, can't instantiate.`);
    }
    return WebsocketConnections.instance;
  }
}

export { WebsocketConnections };
