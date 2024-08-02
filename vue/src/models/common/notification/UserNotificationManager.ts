import { Endpoints } from "../../../config/axios/Endpoints";
import { nodeConfig } from "../../../config/env";
import { IUser } from "../../../interfaces/user/UserTypes";
import { INotificationEntity } from "../../../interfaces/user/notification/INotificationEntity";
import { UserNotification } from "./UserNotification";
import { ENotificationState } from "../../../interfaces/user/notification/ENotificationState";
import { useAlertStore } from "../../../stores/alertStore";
import { ResponseStatus } from "../ResponseStatus";
import jwtAxios from "../../../config/axios/jwtAxios";

class UserNotificationManager {
  constructor() {}

  public new = () => {};

  public post = async () => {};

  public put = async (
    user: IUser,
    id: number,
    state: ENotificationState
  ): Promise<UserNotification> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Notification}/${user.id}/${id}/${state}`
    );
    return response.data.edited;
  };

  public delete = async (id: number, status: boolean = false): Promise<UserNotification> => {
    const response = await jwtAxios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Notification}/${id}`
    );
    if (status) {
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return response.data.deleted;
  };

  public get = async (
    user: IUser,
    state?: ENotificationState,
    limit?: number
  ): Promise<Array<UserNotification>> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Notification}/${user.id}/${
        state ? state : "all"
      }/${limit}`
    );
    const got: Array<INotificationEntity> = await response.data.got;
    return got.map((notification) => new UserNotification(notification));
  };
}

export { UserNotificationManager };
