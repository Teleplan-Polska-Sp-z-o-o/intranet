import axios from "axios";
import { Endpoints } from "../../../config/Endpoints";
import { nodeConfig } from "../../../config/env";
import { IUser } from "../../../interfaces/user/IUser";
import { INotificationEntity } from "../../../interfaces/user/notification/INotificationEntity";
import { UserNotification } from "./UserNotification";
import { ENotificationState } from "../../../interfaces/user/notification/ENotificationState";

class UserNotificationManager {
  constructor() {}

  public new = () => {};

  public post = async () => {};

  public put = async (
    user: IUser,
    id: number,
    state: ENotificationState
  ): Promise<UserNotification> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Notification}/${user.id}/${id}/${state}`
    );
    return response.data.edited;
  };

  public delete = async () => {};

  public get = async (
    user: IUser,
    state?: ENotificationState,
    limit?: number
  ): Promise<Array<UserNotification>> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Notification}/${user.id}/${
        state ? state : "all"
      }/${limit}`
    );
    const got: Array<INotificationEntity> = await response.data.got;
    return got.map((notification) => new UserNotification(notification));
  };
}

export { UserNotificationManager };
