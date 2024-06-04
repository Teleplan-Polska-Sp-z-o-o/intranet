import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
// import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
// import { ResponseStatus } from "../common/ResponseStatus";

class UserTokenManager {
  constructor() {}

  public verify = async (token: string): Promise<boolean> => {
    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/token/verify`,
      { token }
    );
    return response.data.token;
  };
  public refresh = async (token: string): Promise<string> => {
    const response = await axios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/token/refresh`,
      { token }
    );
    return response.data.token;
  };
}

export { UserTokenManager };
