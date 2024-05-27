// import { Request, Response } from "express";
// import { HttpResponseMessage } from "../../enums/response";
// import { cca } from "../../config/msal/msalConfig";
// import { serverConfig } from "../../config/server";

// const signIn = async (_req: Request, res: Response) => {
//   try {
//     const authCodeUrlParameters = {
//       scopes: ["openid", "profile", "offline_access"],
//       redirectUri: `${serverConfig.origin}/`,
//     };

//     const authUrl = await cca.getAuthCodeUrl(authCodeUrlParameters);
//     res.status(200).json({
//       authUrl: authUrl,
//       message: "Signed successfully to MS.",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error signing in:", error);
//     res.status(500).json({
//       message: "Unknown error occurred. Failed to sign in MS.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

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
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error MS callback:", error);
//     res.status(500).json({
//       message: "Unknown error occurred. Failed MS callback.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// export { signIn, callback };
