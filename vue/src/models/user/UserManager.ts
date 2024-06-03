import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { UserEntity } from "./UserEntity";
import { IUserEntity } from "../../interfaces/user/IUserEntity";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../common/ResponseStatus";

class UserManager {
  constructor() {}

  public new = () => new UserEntity();

  public get = async (
    equalOrAbovePermission?: "moderator" | "admin"
  ): Promise<Array<IUserEntity>> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/all/${equalOrAbovePermission}`
    );
    return response.data.users;
  };

  public getOne = async (username: string): Promise<IUserEntity> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/one/${username}`
    );
    return response.data.user;
  };

  public put = async (
    reqData: FormData,
    status: boolean = false
  ): Promise<Array<any> | IResponseStatus> => {
    const response = await axios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}`,
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

  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<Array<IUserEntity> | IResponseStatus> => {
    const response = await axios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/${id}`
    );
    if (status) {
      return new ResponseStatus({
        code: response.status,
        message: response.data.statusMessage,
      });
    }
    return response.data.deleted;
  };
}

export { UserManager };
