import { IUser } from "../../interfaces/user/IUser";
import { ISocketConnection } from "../../interfaces/websocket/ISocketConnection";

class WebsocketConnections {
  static connections: Array<ISocketConnection> = [];

  constructor() {}

  public addConnection = (conn: ISocketConnection) => {
    WebsocketConnections.connections.push(conn);
  };

  public replaceConnection = (existingIndex: number, conn: ISocketConnection) => {
    WebsocketConnections.connections[existingIndex] = conn;
  };

  public findIndexOfConnection = (parsedMsg: { user: IUser }): number => {
    return WebsocketConnections.connections.findIndex((connection) => {
      return connection.user.username === parsedMsg.user.username;
    });
  };

  public removeConnection = (parsedMsg: { userToRemove: IUser }) => {
    const indexToRemove = this.findIndexOfConnection({ user: { ...parsedMsg.userToRemove } });
    if (indexToRemove !== -1) {
      WebsocketConnections.connections.splice(indexToRemove, 1);
    }
  };

  public getConnections = () => WebsocketConnections.connections;
}

export { WebsocketConnections };
