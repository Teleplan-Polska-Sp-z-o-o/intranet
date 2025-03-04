import { IPortConfig } from "./IPortConfig";

interface IServerConfig extends IPortConfig {
  test: boolean;
  host: string;
  origin: string;
  production_origin: string;
  port: number;
  apiKey: string;
}

export { IServerConfig };
