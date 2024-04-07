import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { UserEntity } from "./UserEntity";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../common/ResponseStatus";

class UserPermissionManager {
  constructor() {}

  public new = () => new UserEntity();

  public get = async (): Promise<Array<any>> => {
    const response = await axios.get(`${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}`);
    return response.data.users;
  };

  public put = async (
    reqData: any,
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
}

export { UserPermissionManager };
