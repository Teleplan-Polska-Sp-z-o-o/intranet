import { IPortConfig } from "./IPortConfig";

interface IServerConfig extends IPortConfig {
  host: string;
  origin: string;
  port: number;
  apiKey: string;
}

export { IServerConfig };
