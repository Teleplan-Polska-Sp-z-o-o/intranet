// import * as dotenv from "dotenv";
// import { LogLevel } from "@azure/msal-node";

// dotenv.config({ path: "./../.env" });

// const msalConfig = {
//   auth: {
//     clientId: process.env.MS_CLIENT_ID,
//     authority: `${process.env.MS_CLOUD_INSTANCE}${process.env.MS_TENANT_ID}`,
//     clientSecret: process.env.MS_CLIENT_SECRET,
//   },
//   system: {
//     loggerOptions: {
//       loggerCallback(loglevel: LogLevel, message: string, containsPii: boolean): void {
//         console.log(message);
//       },
//       piiLoggingEnabled: false,
//       logLevel: LogLevel.Verbose,
//     },
//   },
// };

// const REDIRECT_URI = process.env.MS_REDIRECT_URI;
// const POST_LOGOUT_REDIRECT_URI = process.env.MS_POST_LOGOUT_REDIRECT_URI;
// const GRAPH_ME_ENDPOINT = process.env.MS_GRAPH_API_ENDPOINT + "v1.0/me";

// export { msalConfig, REDIRECT_URI, POST_LOGOUT_REDIRECT_URI, GRAPH_ME_ENDPOINT };
