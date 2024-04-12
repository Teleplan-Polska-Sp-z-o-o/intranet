import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { UserEntity } from "./UserEntity";
import { IUserEntity } from "../../interfaces/user/IUserEntity";

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
}

export { UserManager };
