import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
// import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
// import { ResponseStatus } from "../common/ResponseStatus";

class UserTokenManager {
  constructor() {}

  public verify = async (token: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/token/verify`,
        { token }
      );
      return response.data.token;
    } catch (error) {
      return false;
    }
  };
  public refresh = async (token: string): Promise<string> => {
    try {
      const response = await axios.post(
        `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/token/refresh`,
        { token }
      );
      return response.data.token;
    } catch (error) {
      return "";
    }
  };
}

export { UserTokenManager };
