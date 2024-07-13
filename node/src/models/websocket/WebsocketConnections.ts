import { dataSource } from "../../config/orm/dataSource";
import { IUser } from "../../interfaces/user/UserTypes";
import { ISocketConnection } from "../../interfaces/websocket/ISocketConnection";
import { UserHeartbeat } from "./UserHeartbeat";

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

  public async addConnection(conn: ISocketConnection): Promise<void> {
    this.connections.push(conn);

    const latestLoginDetails = await UserHeartbeat.getLastLoginRecord(conn.user, dataSource);

    if (latestLoginDetails && !latestLoginDetails.logoutTime) {
      await UserHeartbeat.updateLogoutDetails(conn.user);
    }
    await UserHeartbeat.saveLoginDetails(conn.user);
  }

  public async replaceConnection(existingIndex: number, conn: ISocketConnection): Promise<void> {
    const existingConnection = this.connections[existingIndex];
    if (existingConnection.ws.readyState !== 1) {
      this.connections[existingIndex] = conn;

      const latestLoginDetails = await UserHeartbeat.getLastLoginRecord(conn.user, dataSource);

      if (latestLoginDetails && !latestLoginDetails.logoutTime) {
        await UserHeartbeat.updateLogoutDetails(conn.user);
      }
      await UserHeartbeat.saveLoginDetails(conn.user);
    }
  }

  public findIndexOfConnection(parsedMsg: { user: IUser }): number {
    return this.connections.findIndex((connection) => {
      return connection.user.username === parsedMsg.user.username;
    });
  }

  public async removeClosedConnections(): Promise<void> {
    const closedConnections = this.connections.filter((connection) => {
      return connection.ws.readyState !== 1;
    });

    for (const connection of closedConnections) {
      await UserHeartbeat.updateLogoutDetails(connection.user);
    }

    this.connections = this.connections.filter((connection) => {
      return connection.ws.readyState === 1;
    });
  }

  public getConnections = (): Array<ISocketConnection> => this.connections;

  public async handleHeartbeat(): Promise<void> {
    for (const connection of this.connections) {
      if (connection.ws.readyState !== 1) {
        await UserHeartbeat.updateLogoutDetails(connection.user);
      }
    }
    this.connections = this.connections.filter((connection) => connection.ws.readyState === 1);
  }
}

export { WebsocketConnections };
