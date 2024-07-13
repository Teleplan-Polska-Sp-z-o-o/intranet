# TODO

what i have so far for serving logged users count

on every user login i call UserHeartbeat.saveLoginDetails(userExist); in login endpoint

and that works for login, the problem is with logout

on frontend i call // Close WebSocket connection if navigating to '/' and coming from a different route
if (to.path === "/" && from.path !== "/") {
const websocketStore = useWebsocketStore();
websocketStore.closeConnection();
}

for backend

every 60 seconds const initializeInterval = () => {
if (!intervalInitialized) {
intervalInitialized = true;
setInterval(() => {
checkConnection();
}, 60000);
}
};

which results in connecting with backend if ws is not connected

this is my websocket controller on backend:

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
          WC.addConnection({ ws, user: parsedMsg.user });
        } else {
          WC.replaceConnection(existingIndex, { ws, user: parsedMsg.user });
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
console.error("WebSocket error:", error.toString());
ws.close(1000, "WebSocket error occurred");
WC.removeClosedConnections();
});
};

const getWebSocketConnections = (): Array<ISocketConnection> => {
const WC: WebsocketConnections = WebsocketConnections.getInstance();

return WC.getConnections();
};

export { websocketController, getWebSocketConnections };

this is my userheartbeat class:

import { UserLoginDetails } from "../../orm/entity/user/UserLoginDetailsEntity";
import { dataSource } from "../../config/orm/dataSource";
import { IUser } from "../../interfaces/user/UserTypes";
import { User } from "../../orm/entity/user/UserEntity";
import { EntityManager } from "typeorm";

class UserHeartbeat {
constructor() {}

private static getLastLoginRecord = async (
user: IUser,
entityManager: EntityManager
): Promise<UserLoginDetails> => {
// Find the most recent login record for the user
const latestLoginDetails = await entityManager.getRepository(UserLoginDetails).findOne({
where: { user: user },
order: { loginTime: "DESC" },
});

    return latestLoginDetails;

};

static saveLoginDetails = async (user: IUser) => {
try {
await dataSource.transaction(async (transactionalEntityManager) => {
const userEntity = await transactionalEntityManager
.getRepository(User)
.findOne({ where: { username: user.username } });

        const latestLoginDetails = await UserHeartbeat.getLastLoginRecord(
          user,
          transactionalEntityManager
        );

        if (latestLoginDetails && !latestLoginDetails.logoutTime) {
          // Remove the previous session if it's still open
          await transactionalEntityManager
            .getRepository(UserLoginDetails)
            .remove(latestLoginDetails);
        }

        // Create a new login details record
        const loginDetails = new UserLoginDetails(userEntity);
        await transactionalEntityManager.getRepository(UserLoginDetails).save(loginDetails);
      });
    } catch (error) {
      console.log(`saveLoginDetails at UserHeartbeat, error: ${error}`);
    }

};

static updateLogoutDetails = async (user: IUser) => {
await dataSource.transaction(async (transactionalEntityManager) => {
// Find the most recent login record for the user
const latestLoginDetails = await UserHeartbeat.getLastLoginRecord(
user,
transactionalEntityManager
);

      if (latestLoginDetails) {
        // Update the logout time and calculate the duration
        latestLoginDetails.logoutTime = new Date();
        latestLoginDetails.duration = Math.floor(
          (latestLoginDetails.logoutTime.getTime() - latestLoginDetails.loginTime.getTime()) / 1000
        ); // Calculate duration in seconds
        await transactionalEntityManager.getRepository(UserLoginDetails).save(latestLoginDetails);
      }
    });

};

static cleanOldRecords = async () => {
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    await dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(UserLoginDetails)
        .where("loginTime < :oneWeekAgo", { oneWeekAgo })
        .execute();
    });

};
}

export { UserHeartbeat };

and this is my websocetConnection class:
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

public addConnection = (conn: ISocketConnection): void => {
this.connections.push(conn);
};

public replaceConnection = (existingIndex: number, conn: ISocketConnection): void => {
const existingConnection = this.connections[existingIndex];
if (existingConnection.ws.readyState !== 1) {
this.connections[existingIndex] = conn;
}
};

public findIndexOfConnection = (parsedMsg: { user: IUser }): number => {
return this.connections.findIndex((connection) => {
return connection.user.username === parsedMsg.user.username;
});
};

public removeClosedConnections = (): void => {
const closedConnections = this.connections.filter((connection) => {
return connection.ws.readyState !== 1;
});

    for (const connection of closedConnections) {
      UserHeartbeat.updateLogoutDetails(connection.user);
    }

    this.connections = this.connections.filter((connection) => {
      return connection.ws.readyState === 1;
    });

};

public getConnections = (): Array<ISocketConnection> => this.connections;
}

export { WebsocketConnections };

so what i desire is that:

i know my login counting via login endpoint counts is well..

the problem is that user can refresh frontend page in browser, it wont trigger logout but it will close websocket connection i need to do something like
arrhythmia function in heartbeat class so it will add after websocket close person thats connection got closed and record details is updated if without login again websocket connection will comeback saveLoginDetails will be called as he would login traditionally or tell me how u see it
