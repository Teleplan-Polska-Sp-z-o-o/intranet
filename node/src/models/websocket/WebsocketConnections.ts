import { dataSource } from "../../config/orm/dataSource";
import { IUser } from "../../interfaces/user/UserTypes";
import { ISocketConnection } from "../../interfaces/websocket/ISocketConnection";
import { UserHeartbeat } from "./UserHeartbeat";
import { WebSocket } from "ws";

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

    this.setupHeartbeat(conn.ws);
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

      this.setupHeartbeat(conn.ws);
    }
  }

  public findIndexOfConnection(parsedMsg: { user: IUser }): number {
    return this.connections.findIndex((connection) => {
      return connection.user.username === parsedMsg.user.username;
    });
  }

  public async removeClosedConnections(): Promise<void> {
    const currentTime = Date.now();
    const closedConnections = this.connections.filter((connection) => {
      return connection.ws.readyState !== 1;
    });

    for (const connection of closedConnections) {
      await UserHeartbeat.updateLogoutDetails(connection.user);
    }

    this.connections = this.connections.filter((connection) => {
      return (
        connection.ws.readyState === 1 &&
        currentTime - connection.lastHeartbeat <=
          UserHeartbeat.HEARTBEAT_INTERVAL + UserHeartbeat.HEARTBEAT_TIMEOUT
      );
    });
  }

  public getConnections = (): Array<ISocketConnection> => this.connections;

  private setupHeartbeat(ws: WebSocket) {
    ws.on("pong", () => {
      const connection = this.connections.find((conn) => conn.ws === ws);
      if (connection) {
        connection.lastHeartbeat = Date.now();
      }
    });

    const pingInterval = setInterval(() => {
      if (ws.readyState === 1) {
        ws.ping((error: Error) => {
          if (error) {
            ws.close(1000, "Ping error occurred");
            this.removeClosedConnections();
          }
        });
      } else {
        clearInterval(pingInterval);
      }
    }, UserHeartbeat.HEARTBEAT_INTERVAL);

    ws.on("close", () => {
      clearInterval(pingInterval);
      this.removeClosedConnections();
    });

    ws.on("error", (error: Error) => {
      ws.close(1000, "WebSocket error occurred");
      clearInterval(pingInterval);
      this.removeClosedConnections();
    });
  }
}

export { WebsocketConnections };
