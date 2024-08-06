import { IUser } from "../../interfaces/user/UserTypes";
import { ISocketConnection } from "../../interfaces/websocket/ISocketConnection";
import { WebsocketConnections } from "./WebsocketConnections";
import { WebsocketRequestHandler } from "express-ws";
import { WebSocket } from "ws";

const WebsocketManager: WebsocketRequestHandler = (ws: WebSocket) => {
  const WC: WebsocketConnections = WebsocketConnections.getInstance();

  ws.on("message", function (msg: string) {
    const parsedMsg = JSON.parse(msg);

    const isIUser = (obj: any): obj is IUser => {
      return typeof obj === "object" && obj !== null && "username" in obj;
    };

    if (isIUser(parsedMsg?.user)) {
      const existingIndex = WC.findIndexOfConnection(parsedMsg);
      if (existingIndex === -1) {
        WC.addConnection({ ws, user: parsedMsg.user, lastHeartbeat: Date.now() });
      } else {
        WC.replaceConnection(existingIndex, {
          ws,
          user: parsedMsg.user,
          lastHeartbeat: Date.now(),
        });
      }
    }
  });

  ws.on("close", () => {
    WC.removeClosedConnections();
  });

  ws.on("error", (error) => {
    console.error("WebSocket error occurred:", error);
    ws.close(1000, "WebSocket error occurred");
    WC.removeClosedConnections();
  });
};

const getWebSocketConnections = (): Array<ISocketConnection> => {
  const WC: WebsocketConnections = WebsocketConnections.getInstance();

  return WC.getConnections();
};

export { WebsocketManager, getWebSocketConnections };
