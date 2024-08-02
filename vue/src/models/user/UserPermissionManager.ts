import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/axios/Endpoints";
import { UserEntity } from "./UserEntity";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../common/ResponseStatus";
import { UserManager } from "./UserManager";
import { useAlertStore } from "../../stores/alertStore";
import jwtAxios from "../../config/axios/jwtAxios";

class UserPermissionManager extends UserManager {
  constructor() {
    super();
  }

  public new = () => new UserEntity();

  public put = async (
    reqData: FormData,
    status: boolean = false
  ): Promise<Array<any> | IResponseStatus> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserPermission}`,
      reqData
    );
    if (status) {
      // return new ResponseStatus({
      //   code: response.status,
      //   message: response.data.statusMessage,
      // });
      useAlertStore().process(
        new ResponseStatus({
          code: response.status,
          message: response.data.statusMessage,
        })
      );
    }
    return response.data.edited;
  };

  public getOne = async (iUserJson: string): Promise<UserEntity> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserPermission}/${iUserJson}`
    );
    return response.data.user;
  };
}

export { UserPermissionManager };
