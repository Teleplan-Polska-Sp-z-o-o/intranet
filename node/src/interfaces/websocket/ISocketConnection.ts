import { IUser } from "../user/IUser";

interface ISocketConnection {
  ws: WebSocket;
  user: IUser;
}

export type { ISocketConnection };
