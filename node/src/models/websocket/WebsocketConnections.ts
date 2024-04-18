import { IUser } from "../../interfaces/user/IUser";
import { ISocketConnection } from "../../interfaces/websocket/ISocketConnection";

class WebsocketConnections {
  private static instance: WebsocketConnections;
  private connections: Array<ISocketConnection> = [];

  private constructor() {}

  public static getInstance(): WebsocketConnections {
    if (!WebsocketConnections.instance) {
      WebsocketConnections.instance = new WebsocketConnections();
    }
    return WebsocketConnections.instance;
  }

  public addConnection = (conn: ISocketConnection): void => {
    this.connections.push(conn);
  };

  public replaceConnection = (existingIndex: number, conn: ISocketConnection): void => {
    if (this.connections[existingIndex].ws.readyState !== 1) {
      this.connections[existingIndex] = conn;
    }
  };

  public findIndexOfConnection = (parsedMsg: { user: IUser }): number => {
    return this.connections.findIndex((connection) => {
      return connection.user.username === parsedMsg.user.username;
    });
  };

  public removeClosedConnection = (): void => {
    const indexToRemove = this.connections.findIndex((connection) => {
      return connection.ws.readyState !== 1; // if not OPEN
    });
    if (indexToRemove !== -1) {
      this.connections.splice(indexToRemove, 1);
    }
  };

  public getConnections = (): Array<ISocketConnection> => this.connections;
}

export { WebsocketConnections };
