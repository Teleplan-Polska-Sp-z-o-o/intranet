import { IUser } from "../user/UserTypes";
import { WebSocket } from "ws";

interface ISocketConnection {
  ws: WebSocket;
  user: IUser;
  lastHeartbeat: number;
}

export type { ISocketConnection };
