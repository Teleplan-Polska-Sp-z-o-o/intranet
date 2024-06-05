import axios from "axios";
import { Endpoints } from "./Endpoints";

interface ServerConfig {
  origin: string | undefined;
  port: number | undefined;
}

const TEST_ORIGIN = "http://172.20.176.1";
// const TEST_PORT = undefined;
const ORIGIN = "https://bydintranet.reconext.com";
// const PORT = undefined;

let nodeConfig: ServerConfig = {
  origin: undefined,
  port: undefined,
};

const fetchPing = async (
  origin: string = window.location.origin,
  port: number = 3000
): Promise<ServerConfig> =>
  (await axios.get(`${origin}:${port}${Endpoints.ServerConfig}/ping`)).data.config;

const getNodeConfig = async () => {
  try {
    switch (window.location.origin) {
      case TEST_ORIGIN:
        nodeConfig = await fetchPing(TEST_ORIGIN);
        break;
      case ORIGIN:
        nodeConfig = await fetchPing(ORIGIN);
        break;

      default:
        console.warn(
          `switch for window.location.origin at getNodeConfig at env.ts could not find a case, trying to fetch nodeConfig from ${
            window.location.origin
          }:${3000}`
        );
        nodeConfig = await fetchPing();

        break;
    }
  } catch (error) {
    console.log(error);
  }
};

getNodeConfig();

// old
// const nodeConfig: ServerConfig = {
//   origin: "http://172.20.176.1",
//   // origin: "https://bydintranet.reconext.com",
//   port: 3000,
// };

export { nodeConfig };
