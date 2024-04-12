import { IUser } from "../../interfaces/user/IUser";
import { ISocketConnection } from "../../interfaces/websocket/ISocketConnection";
import { WebsocketConnections } from "../../models/websocket/WebsocketConnections";

const WC = new WebsocketConnections();

const storeWebSocketConnections = (ws: any) => {
  //an event listener is set up for incoming WebSocket messages.
  ws.on("message", function (msg: string) {
    try {
      const parsedMsg = JSON.parse(msg);
      console.log("parsedMsg", parsedMsg);

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
        console.log("existingIndex", existingIndex);
      }

      if (isIUser(parsedMsg?.userToRemove)) {
        const parsedMsg = JSON.parse(msg);
        WC.removeConnection(parsedMsg);
      }
    } catch (error) {
      console.log(error);
    }
  });

  // ws.send("Hello from the server!");
};

const getWebSocketConnections = (): Array<ISocketConnection> => {
  return WC.getConnections();
};

export { storeWebSocketConnections, getWebSocketConnections };
