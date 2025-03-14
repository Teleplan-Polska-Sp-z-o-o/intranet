import { IUser } from "../../interfaces/user/UserTypes";
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

  public addConnection(conn: ISocketConnection): void {
    this.connections.push(conn);
  }

  // public async replaceConnection(existingIndex: number, conn: ISocketConnection): Promise<void> {
  //   const existingConnection = this.connections[existingIndex];
  //   if (existingConnection.ws.readyState !== 1) {
  //     this.connections[existingIndex] = conn;
  //   }
  // }
  public replaceConnection(existingIndex: number, conn: ISocketConnection): void {
    this.connections[existingIndex] = conn;
  }

  public findIndexOfConnection(parsedMsg: { user: IUser }): number {
    return this.connections.findIndex((connection) => {
      return connection.user.username === parsedMsg.user.username;
    });
  }

  public removeClosedConnections(): void {
    this.connections = this.connections.filter((connection) => {
      return connection.ws.readyState === 1;
    });
  }

  public getConnections = (): Array<ISocketConnection> => this.connections;
}

export { WebsocketConnections };
