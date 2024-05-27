import axios from "axios";
import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/Endpoints";
// import { IResponseStatus } from "../../interfaces/common/IResponseStatus";
// import { ResponseStatus } from "../common/ResponseStatus";

class UserMSManager {
  constructor() {}

  // public signIn = async (status: boolean = true): Promise<Array<any> | IResponseStatus> => {
  //   const response = await axios.get(
  //     `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.UsersMs}/signIn`
  //   );
  //   if (status) {
  //     return new ResponseStatus({
  //       code: response.status,
  //       message: response.data.statusMessage,
  //     });
  //   }
  //   return response.data.authUrl;
  // };

  public signIn = async () => {
    try {
      const response = await axios.get(
        `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Msal}/signin`
      );
      // Handle successful login, redirect user, etc.
      return response;
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // const callback = async (req: Request, res: Response) => {
  //   try {
  //     const tokenRequest = {
  //       code: req.query.code as string,
  //       scopes: ["openid", "profile", "offline_access"],
  //       redirectUri: `${serverConfig.origin}/`,
  //     };

  //     const response = await cca.acquireTokenByCode(tokenRequest);
  //     // Handle the response, such as storing tokens or user information

  //     res.status(200).json({
  //       callback: response,
  //       message: "MS Callback successfully.",
  //       statusMessage: HttpResponseMessage.PUT_SUCCESS,
  //     });
  //   } catch (error) {
  //     console.error("Error MS callback:", error);
  //     res.status(500).json({
  //       message: "Unknown error occurred. Failed MS callback.",
  //       statusMessage: HttpResponseMessage.UNKNOWN,
  //     });
  //   }
  // };
}

export { UserMSManager };
