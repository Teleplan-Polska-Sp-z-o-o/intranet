import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/axios/Endpoints";
import { UserManager } from "./UserManager";
import { IUserLoginDetails } from "../../interfaces/user/UserTypes";
import jwtAxios from "../../config/axios/jwtAxios";

class UserLoginDetailsManager extends UserManager {
  constructor() {
    super();
  }

  public getUserDetails = async (): Promise<IUserLoginDetails[]> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/login-details`
    );
    return response.data.loginDetails;
  };
}

export { UserLoginDetailsManager };
