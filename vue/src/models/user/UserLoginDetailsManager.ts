import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
import { UserManager } from "./UserManager";
import { IUserLoginDetails } from "../../interfaces/user/UserTypes";

class UserLoginDetailsManager extends UserManager {
  constructor() {
    super();
  }

  public getUserDetails = async (): Promise<IUserLoginDetails[]> => {
    const response = await axios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/login-details`
    );
    return response.data.loginDetails;
  };
}

export { UserLoginDetailsManager };
