import { nodeConfig } from "../../config/env";
import { Endpoints } from "../../config/axios/Endpoints";
import { TPermissionGroup, UserTypes } from "../../interfaces/user/UserTypes";
import jwtAxios from "../../config/axios/jwtAxios";

class UserToolStatisticsManager {
  constructor() {}

  public post = async (
    toolName: TPermissionGroup
  ): Promise<UserTypes.ToolStatistics.StatisticsEntity> => {
    const response = await jwtAxios.post(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/statistics/usage/${toolName}`
    );
    return response.data.statistics;
  };

  public get = async (): Promise<UserTypes.ToolStatistics.StatisticsEntity[]> => {
    const response = await jwtAxios.get(
      `${nodeConfig.origin}:${nodeConfig.port}${Endpoints.Users}/statistics/usage`
    );
    return response.data.statistics;
  };
}

export { UserToolStatisticsManager };
