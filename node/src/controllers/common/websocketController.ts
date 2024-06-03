import { IUser } from "../../interfaces/user/IUser";
import { ISocketConnection } from "../../interfaces/websocket/ISocketConnection";
import { WebsocketConnections } from "../../models/websocket/WebsocketConnections";

const websocketController = (ws: any, _req: Request) => {
  const WC: WebsocketConnections = WebsocketConnections.getInstance();

  ws.on("message", function (msg: string) {
    try {
      const parsedMsg = JSON.parse(msg);

      const isIUser = (obj: any): obj is IUser => {
        return typeof obj === "object" && obj !== null && "username" in obj;
      };

      if (isIUser(parsedMsg?.user)) {
        const existingIndex = WC.findIndexOfConnection(parsedMsg);
        if (existingIndex === -1) {
          WC.addConnection({ ws, user: parsedMsg.user });
        } else {
          WC.replaceConnection(existingIndex, { ws, user: parsedMsg.user });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  ws.onclose = () => {
    WC.removeClosedConnections();
  };
};

const getWebSocketConnections = (): Array<ISocketConnection> => {
  const WC: WebsocketConnections = WebsocketConnections.getInstance();

  return WC.getConnections();
};

export { websocketController, getWebSocketConnections };
