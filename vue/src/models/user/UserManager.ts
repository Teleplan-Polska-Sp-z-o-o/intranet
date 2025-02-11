import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/axios/Endpoints";
import { UserEntity } from "./UserEntity";
import { IUserEntity } from "../../interfaces/user/IUserEntity";
import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
import { ResponseStatus } from "../common/ResponseStatus";
import { useAlertStore } from "../../stores/alertStore";
import jwtAxios from "../../config/axios/jwtAxios";

class UserManager {
  constructor() {}

  public new = () => new UserEntity();

  public get = async (
    equalOrAbovePermission?: "moderator" | "admin"
  ): Promise<Array<IUserEntity>> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/all/${equalOrAbovePermission}`
    );
    return response.data.users;
  };

  public getOne = async (username: string): Promise<IUserEntity> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/one/${username}`
    );
    return response.data.user;
  };

  public put = async (
    reqData: FormData,
    status: boolean = false
  ): Promise<Array<any> | IResponseStatus> => {
    const response = await jwtAxios.put(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}`,
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

  public delete = async (
    id: number,
    status: boolean = false
  ): Promise<Array<IUserEntity> | IResponseStatus> => {
    const response = await jwtAxios.delete(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/${id}`
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
    return response.data.deleted;
  };

  public getByGroupAndSubgroup = async (
    group: string,
    subgroup?: string
  ): Promise<Array<IUserEntity>> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/group-subgroup/${group}${
        subgroup ? `/${subgroup}` : ""
      }`
    );
    return response.data.users;
  };
}

export { UserManager };
