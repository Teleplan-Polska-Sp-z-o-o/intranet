import { IUser } from "../../interfaces/user/UserTypes";
import { ISocketConnection } from "../../interfaces/websocket/ISocketConnection";
import { WebsocketConnections } from "../../models/websocket/WebsocketConnections";
import { WebsocketRequestHandler } from "express-ws";
import { Request, NextFunction } from "express";
import { WebSocket } from "ws";

const websocketController: WebsocketRequestHandler = (
  ws: WebSocket,
  req: Request,
  next: NextFunction
) => {
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
          WC.addConnection({ ws, user: parsedMsg.user, lastHeartbeat: Date.now() });
        } else {
          WC.replaceConnection(existingIndex, {
            ws,
            user: parsedMsg.user,
            lastHeartbeat: Date.now(),
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  ws.on("close", () => {
    WC.removeClosedConnections();
  });

  ws.on("error", (error) => {
    ws.close(1000, "WebSocket error occurred");
    WC.removeClosedConnections();
  });
};

const getWebSocketConnections = (): Array<ISocketConnection> => {
  const WC: WebsocketConnections = WebsocketConnections.getInstance();

  return WC.getConnections();
};

export { websocketController, getWebSocketConnections };
