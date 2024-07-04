import { IUser } from "../user/UserTypes";

interface ISocketConnection {
  ws: WebSocket;
  user: IUser;
}

export type { ISocketConnection };
