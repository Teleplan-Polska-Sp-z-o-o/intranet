import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { UserEntity } from "./UserEntity";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../common/ResponseStatus";
import { UserManager } from "./UserManager";

class UserPermissionManager extends UserManager {
  constructor() {
    super();
  }

  public new = () => new UserEntity();

  public put = async (
    reqData: FormData,
    status: boolean = false
  ): Promise<Array<any> | IResponseStatus> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserPermission}`,
      reqData
    );
    if (status) {
      return new ResponseStatus({
        code: response.status,
        message: response.data.statusMessage,
      });
    }
    return response.data.edited;
  };

  public getOne = async (iUserJson: string): Promise<UserEntity> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserPermission}/${iUserJson}`
    );
    return response.data.user;
  };
}

export { UserPermissionManager };
