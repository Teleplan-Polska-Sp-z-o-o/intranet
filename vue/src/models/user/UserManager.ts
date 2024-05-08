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
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/${equalOrAbovePermission}`
    );
    return response.data.users;
  };

  public put = async (
    reqData: { formData: FormData; controller: string },
    status: boolean = false
  ): Promise<Array<any> | IResponseStatus> => {
    const controller = reqData.controller;

    switch (controller) {
      case "permissionController":
        const response = await axios.put(
          `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UserPermission}`,
          reqData.formData
        );
        if (status) {
          return new ResponseStatus({
            code: response.status,
            message: response.data.statusMessage,
          });
        }
        return response.data.edited;

      default:
        throw new Error("FormData controller value does not found the match in switch statement");
    }
  };
}

export { UserManager };
